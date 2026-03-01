use serde::Serialize;

#[derive(Serialize)]
pub struct OwnerInfo{
    name: String,
    division: String,
}

const OWNER_NAME: &str = "Light Store";

#[tauri::command]
pub fn get_owner_info() -> OwnerInfo {
    OwnerInfo{
        name: OWNER_NAME.to_string(),
        division: "Склад".to_string(),
    }
}
