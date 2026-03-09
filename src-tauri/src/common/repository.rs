use serde::{Deserialize, Serialize};

pub mod file_repository;
pub mod file_repository_config;

pub trait Entity {
   fn id(&self) -> u32;
}
pub trait BasicRepository<T> : Send
   where T : Entity,
   for<'a> T: Serialize + Deserialize<'a> {

   fn get_all(&mut self) -> Result<Vec<T>,String>;
   fn save_new_item(&mut self, item: &T) -> Result<(),String>;

   fn get_next_id(&mut self) -> Result<u32,String>;
}