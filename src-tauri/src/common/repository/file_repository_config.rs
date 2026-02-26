use std::path::{Path, PathBuf};

pub enum DbEntity {
   Stock,
   StockIn,
   StockOut,
   CounterpartyCatalog,
   ProductCatalog,
}

impl DbEntity {
   fn get_file_name(&self) -> &str {
      match self {
         DbEntity::Stock => "stock.db",
         DbEntity::StockIn => "stock_in.db",
         DbEntity::StockOut => "stock_out.db",
         DbEntity::CounterpartyCatalog => "counterparty_catalog.db",
         DbEntity::ProductCatalog => "product_catalog.db",
      }
   }
}

const DEFAULT_DATA_PATH: &str = "./data";

pub struct FileRepositoryCofig {
}

impl FileRepositoryCofig {

   pub fn get_db_file_path_for( entity: DbEntity ) -> PathBuf {

      let db_dir = std::env::var("INVENTORY_DATA_PATH")
                           .unwrap_or( DEFAULT_DATA_PATH.to_string() );
      Path::new( &db_dir ).join(entity.get_file_name())
   }
}