use serde::{Deserialize, Serialize};
use crate::common::response::ResponseStatus;
use crate::CounterpartiesRepository;
use crate::product_catalog::{NewProductResponse, Product};

#[derive(Serialize,Deserialize)]
pub struct PaymentDetails {
    pub account: String,
    pub bank: String,
    pub bank_id: String,
}

#[derive(Serialize,Deserialize)]
pub struct Counterparty {
    pub id: u32,
    pub name: String,
    pub legal_id: String,
    pub phone: String,
    pub email: Option<String>,
    pub address: String,
    pub payment_details: Option<PaymentDetails>,
}

#[derive(Serialize,Deserialize)]
pub struct CounterpartiesData {
    pub status: ResponseStatus,
    pub data: Vec<Counterparty>,
}

#[tauri::command]
pub fn get_counterparties( repository: CounterpartiesRepository<'_> ) -> CounterpartiesData {
    match repository.lock().unwrap().get_all() {
        Ok(counterparties) => CounterpartiesData {
            status: ResponseStatus{is_ok:true, error: "".to_string()},
            data: counterparties
        },
        Err(e) => CounterpartiesData {
            status: ResponseStatus{is_ok:false, error: e},
            data: Vec::new()
        }
    }
}

#[tauri::command]
pub fn add_counterparty( repository: CounterpartiesRepository<'_>, request: Counterparty ) -> ResponseStatus {
    let all_items = match repository.lock().unwrap().get_all() {
        Ok(product) => product,
        Err(err) => return ResponseStatus { is_ok: false, error: err }
    };

    let next_id = all_items.iter()
        .map( |data| data.id)
        .max()
        .unwrap_or(0)
        + 1;

    match repository.lock().unwrap().save_new_item( &Counterparty { id: next_id, ..request } ) {
        Ok(_) => ResponseStatus{ is_ok: true, error: String::new() },
        Err(err) => ResponseStatus { is_ok: false, error: err },
    }

}