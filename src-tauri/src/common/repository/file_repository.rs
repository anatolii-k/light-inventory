use std::{fs::{File, OpenOptions}, io::{BufRead, BufReader, BufWriter, Write}, marker::PhantomData, path::PathBuf};

use serde::{Deserialize, Serialize};

use crate::common::repository::BasicRepository;

enum FileMode {
    READ,
    WRITE,
    APPEND,
}

pub struct FileBasicRepository<T> {
   file_path: PathBuf,
   _marker: PhantomData<T>,
}

impl<T> FileBasicRepository<T> {

   pub fn new(file_path: PathBuf) -> Self {
      Self{ file_path, _marker: PhantomData }
   }

   fn open_file( &self, mode: FileMode ) -> Result<(File,&PathBuf),String> {

      let mut open_options = OpenOptions::new();
      match mode {
         FileMode::READ  => open_options.read(true),
         FileMode::WRITE => open_options.write(true).truncate(true),
         FileMode::APPEND => open_options.write(true).append(true),
      };

      let file = open_options.open(&self.file_path)
         .map_err(|err| format!("Cannot open file [{:?}]: {}", &self.file_path, err.to_string()))?;

      Ok(( file, &self.file_path ))
   }

}

impl <T> BasicRepository<T> for FileBasicRepository<T>
where for<'a> T: Serialize + Deserialize<'a> {

    fn get_all(&mut self) -> Result<Vec<T>,String> {

        let (file, file_path) = self.open_file(FileMode::READ)?;

        let mut reader = BufReader::new(file);
        let mut rawline = String::new();

        let mut result: Vec<T> = Vec::new();

        while 0 < reader.read_line(&mut rawline)
                .map_err(|err| format!("Cannot read from file [{:?}]: {}", &file_path, err.to_string()))?  {
            let line = rawline.trim();
            if line.is_empty() {
                continue;
            }        
            let product: T = serde_json::from_str( &line )
                                    .map_err(|err| format!("Cannot convert line (JSON) from file [{:?}]: {}. Line: {}", &file_path, err.to_string(), line))?;
            result.push(product);
            rawline.clear();
        }
        Ok(result)

    }

    fn save_new_item(&mut self, item: &T) -> Result<(),String>{
        
        let (file, file_path) = self.open_file(FileMode::APPEND)?;

        let mut writer = BufWriter::new(file);

        let line = serde_json::to_string(item)
                                .map_err(|err| format!("Cannot serialize Product to JSON: {:?}", err))?;
        writeln!(writer, "{}", line)
                .map_err(|err| format!("Enable to write to buffer during writing to file [{:?}]. Error: {}", file_path, err.to_string()))?;
        writer.flush()
            .map_err(|err| format!("Enable to write to file [{:?}]. Error: {}", file_path, err.to_string()))?;

        Ok(())
    }
}