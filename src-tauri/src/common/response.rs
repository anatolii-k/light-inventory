use serde::{Deserialize, Serialize};

#[derive(Serialize,Deserialize,Debug)]
pub struct ResponseStatus {
    pub is_ok: bool,
    pub error: String,
}