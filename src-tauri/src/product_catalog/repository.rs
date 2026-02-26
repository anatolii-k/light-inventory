use std::{fs::{File, OpenOptions}, io::{self, BufRead, BufReader, BufWriter, Error, Write}, path::{Path, PathBuf}};
use super::Product;

pub struct FileRepository{}

const PRODUCT_CATALOG_DB_FILE: &str = "product_catalog.db";
const DEFAULT_DATA_PATH: &str = "./data";

enum FileMode {
    READ,
    WRITE,
    APPEND,
}

impl FileRepository {

    pub fn get_product_catalog() -> Result< Vec<Product>, String> {


        let (file, file_path) = Self::open_file(FileMode::READ)?;

        let mut reader = BufReader::new(file);
        let mut rawline = String::new();

        let mut result: Vec<super::Product> = Vec::new();

        while 0 < reader.read_line(&mut rawline)
                .map_err(|err| format!("Cannot read from file [{:?}]: {}", &file_path, err.to_string()))?  {
            let line = rawline.trim();
            if line.is_empty() {
                continue;
            }        
            let product: Product = serde_json::from_str( &line )
                                    .map_err(|err| format!("Cannot convert line (JSON) from file [{:?}]: {}. Line: {}", &file_path, err.to_string(), line))?;
            result.push(product);
            rawline.clear();
        }
        Ok(result)
    }

    pub fn save_new_record( data : &Product ) -> Result<(),String> {

        let (file, file_path) = Self::open_file(FileMode::APPEND)?;

        let mut writer = BufWriter::new(file);

        let line = serde_json::to_string(data)
                                .map_err(|err| format!("Cannot serialize Product to JSON: {:?}", err))?;
        writeln!(writer, "{}", line);
        writer.flush().map_err(|err| format!("Enable to write to file [{:?}]. Error: {}", file_path, err.to_string()))?;

        Ok(())
    }

    fn open_file( mode: FileMode ) -> Result<(File,PathBuf),String> {
        let db_dir = std::env::var("INVENTORY_DATA_PATH").unwrap_or( DEFAULT_DATA_PATH.to_string() );
        let file_path  = Path::new( &db_dir ).join(PRODUCT_CATALOG_DB_FILE);

        let mut open_options = OpenOptions::new();
        match mode {
            FileMode::READ  => open_options.read(true),
            FileMode::WRITE => open_options.write(true).truncate(true),
            FileMode::APPEND => open_options.write(true).append(true),
        };

        let file = open_options.open(&file_path)
            .map_err(|err| format!("Cannot open file [{:?}]: {}", &file_path, err.to_string()))?;

        Ok((file,file_path))
    }


    
}
