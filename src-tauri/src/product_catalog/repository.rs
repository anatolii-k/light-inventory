use std::{fs::File, io::{self, BufRead, BufReader, Error}, path::Path};
use super::Product;

pub struct FileRepository{}

const PRODUCT_CATALOG_DB_FILE: &str = "product_catalog.db";
const DEFAULT_DATA_PATH: &str = "./data";

impl FileRepository {

    pub fn get_product_catalog() -> Result< Vec<Product>, String> {

        let db_dir = std::env::var("INVENTORY_DATA_PATH").unwrap_or( DEFAULT_DATA_PATH.to_string() );
        let db_file  = Path::new( &db_dir ).join(PRODUCT_CATALOG_DB_FILE);

        let file = File::open(&db_file)
            .map_err(|err| format!("Cannot open file [{:?}]: {}", &db_file, err.to_string()))?;

        let mut reader = BufReader::new(file);
        let mut line = String::new();

        let mut result: Vec<super::Product> = Vec::new();

        while 0 < reader.read_line(&mut line)
                .map_err(|err| format!("Cannot read from file [{:?}]: {}", &db_file, err.to_string()))?  {
                    
            let product: Product = serde_json::from_str( &line )
                                    .map_err(|err| format!("Cannot convert line (JSON) from file [{:?}]: {}. Line: {}", &db_file, err.to_string(), line))?;
            result.push(product);
            line.clear();
        }
        Ok(result)
    }
    
}
