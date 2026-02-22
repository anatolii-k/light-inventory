use serde::Serialize;

#[derive(Serialize)]
pub struct OwnerInfo{
    name: String,
    division: String,
}

#[tauri::command]
pub fn get_owner_info() -> OwnerInfo {
    OwnerInfo{
        name: "Light Store".to_string(),
        division: "Склад".to_string(),
    }
}