use serde::Serialize;

#[derive(Serialize)]
pub struct OwnerInfo{
    name: String
}

#[tauri::command]
pub fn get_owner_info() -> OwnerInfo {
    OwnerInfo{name: "ORION STEEL".to_string()}
}