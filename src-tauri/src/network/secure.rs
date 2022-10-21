use libp2p::identity;
use libp2p::identity::ed25519::SecretKey;
use libp2p::identity::Keypair;
use rand::rngs::OsRng;
use std::env;
use std::fs::OpenOptions;
use std::io::BufReader;
use std::io::BufWriter;
use std::path::Path;
use web3::signing::keccak256;

pub fn generate_ed25519(key: &String) -> identity::Keypair {
    let mut hash = keccak256(key.as_bytes());
    let secret_key = SecretKey::from_bytes(&mut hash).unwrap();
    Keypair::Ed25519(secret_key.into())
}

pub fn get_secret() -> String {
    let home_path = match env::var("HOME") {
        // unix path
        Ok(path) => path,
        // windows path
        Err(_) => env::var("HOMEPATH").unwrap(),
    };

    let tochat_path = Path::new("/.tochat").to_string_lossy();
    std::fs::create_dir_all(format!("{}{}", home_path, tochat_path)).unwrap();

    let secret_path = Path::new("/.tochat/secret.json").to_string_lossy();

    let buf = BufReader::new(
        match OpenOptions::new()
            .read(true)
            .open(format!("{}{}", home_path, secret_path))
        {
            // if exists, return; otherwise create a new secret key
            Ok(file) => file,
            Err(_) => {
                let secret_key = secp256k1::SecretKey::new(&mut OsRng);
                let s = format!("{}", secret_key.display_secret());
                let buf = BufWriter::new(
                    OpenOptions::new()
                        .write(true)
                        .create(true)
                        .open(format!("{}{}", home_path, secret_path)).unwrap(),
                );
                serde_json::to_writer_pretty(buf, &s).unwrap();
                OpenOptions::new()
                    .read(true)
                    .open(format!("{}{}", home_path, secret_path)).unwrap()
            }
        },
    );
    serde_json::from_reader(buf).unwrap()
}
