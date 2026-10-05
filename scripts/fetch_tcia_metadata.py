"""
Official TCIA Lung-PET-CT-Dx Metadata Fetcher & Inspector
-------------------------------------------------------
Fetches official subject list, study list, and series metadata directly from the TCIA REST API
for collection: Lung-PET-CT-Dx
"""
import urllib.request
import json
import os

TCIA_API_BASE = "https://services.cancerimagingarchive.net/nbia-api/services/v1/"

def fetch_tcia_json(endpoint, params):
    query_str = "&".join(f"{k}={v}" for k, v in params.items())
    url = f"{TCIA_API_BASE}{endpoint}?{query_str}&format=json"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                return data
            else:
                print(f"Error HTTP {response.status} from TCIA API")
                return None
    except Exception as e:
        print(f"Failed to query TCIA API {url}: {e}")
        return None

def main():
    print("Querying official TCIA REST API for collection: Lung-PET-CT-Dx ...")
    
    # 1. Fetch Patients
    patients = fetch_tcia_json("getPatient", {"Collection": "Lung-PET-CT-Dx"})
    if not patients:
        print("Could not fetch patient list from TCIA API.")
        return

    print(f"Total Subjects returned by TCIA API: {len(patients)}")
    
    # 2. Fetch Series
    series_list = fetch_tcia_json("getSeries", {"Collection": "Lung-PET-CT-Dx"})
    if series_list:
        print(f"Total DICOM Series returned by TCIA API: {len(series_list)}")
    
    # Save raw API metadata for offline audit
    os.makedirs("data/metadata", exist_ok=True)
    with open("data/metadata/tcia_raw_patients.json", "w") as f:
        json.dump(patients, f, indent=2)
        
    if series_list:
        with open("data/metadata/tcia_raw_series.json", "w") as f:
            json.dump(series_list, f, indent=2)

    print("Successfully saved raw TCIA metadata to data/metadata/")

if __name__ == "__main__":
    main()
