use std::sync::{Arc, Mutex};
use serde::{Deserialize, Serialize};
use crate::common::repository::{BasicRepository, Entity};

struct CacheState<T> {
    data: Arc<Vec<T>>,
    invalidated: bool,
}
pub struct CachedBasicRepository<T, R>
where T: Entity + Clone + Send,
for<'a> T: Serialize + Deserialize<'a>,
R: BasicRepository<T>
{
    repository: R,
    cache: Mutex<CacheState<T>>,
}

impl<T,R> CachedBasicRepository<T,R>
where T : Entity + Clone + Send,
for<'a> T: Serialize + Deserialize<'a>,
R: BasicRepository<T>,{

    pub fn new(repository: R) -> Self {
        Self { repository, cache: Mutex::new(CacheState{data: Arc::new(Vec::new()), invalidated: true}) }
    }

    fn get_all_ref(&mut self) -> Result<Arc<Vec<T>>,String> {
        let mut cache = self.cache
            .lock()
            .map_err(|_| "Failed to acquire lock".to_string())?;

        if cache.invalidated {
            cache.data = Arc::new(self.repository.get_all()?);
            cache.invalidated = false;
        }
        Ok(cache.data.clone())
    }
}

impl<T,R> BasicRepository<T> for CachedBasicRepository<T,R>
where T : Entity + Clone + Send + Sync,
for<'a> T: Serialize + Deserialize<'a>,
R: BasicRepository<T>
{

    fn get_all(&mut self) -> Result<Vec<T>, String> {
        let items = self.get_all_ref()?;
        Ok(items.to_vec())
    }

    fn save_new_item(&mut self, item: &T) -> Result<(), String> {
        self.repository.save_new_item(item)?;

        self.cache
            .lock()
            .map_err(|_| "Failed to acquire lock".to_string())?
            .invalidated = true;
        Ok(())
    }

    fn get_next_id(&mut self) -> Result<u32, String> {
        let all_items = self.get_all()?;
        let max_id = all_items.iter()
            .map(|item| item.id())
            .max()
            .unwrap_or(0);
        Ok(max_id + 1)
    }
}