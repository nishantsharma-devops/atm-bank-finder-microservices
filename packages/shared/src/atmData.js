const places = [
  { id: "delhi-sbi-cp", name: "SBI Connaught Place Branch", type: "bank", bank: "State Bank of India", city: "New Delhi", lat: 28.6317, lng: 77.2167, address: "Connaught Place, New Delhi", availability: "Open", cashLevel: "High" },
  { id: "delhi-hdfc-khan", name: "HDFC ATM Khan Market", type: "atm", bank: "HDFC Bank", city: "New Delhi", lat: 28.6007, lng: 77.2265, address: "Khan Market, New Delhi", availability: "Busy", cashLevel: "Medium" },
  { id: "delhi-icici-karol", name: "ICICI Karol Bagh Branch", type: "bank", bank: "ICICI Bank", city: "New Delhi", lat: 28.6519, lng: 77.1909, address: "Karol Bagh, New Delhi", availability: "Open", cashLevel: "High" },
  { id: "gurgaon-axis-cyber", name: "Axis ATM Cyber Hub", type: "atm", bank: "Axis Bank", city: "Gurgaon", lat: 28.4958, lng: 77.089, address: "Cyber Hub, Gurgaon", availability: "Available", cashLevel: "High" },
  { id: "gurgaon-pnb-sohna", name: "PNB Sohna Road Branch", type: "bank", bank: "Punjab National Bank", city: "Gurgaon", lat: 28.4221, lng: 77.0731, address: "Sohna Road, Gurgaon", availability: "Open", cashLevel: "Low" },
  { id: "noida-boi-sec18", name: "Bank of India Sector 18", type: "bank", bank: "Bank of India", city: "Noida", lat: 28.5708, lng: 77.324, address: "Sector 18, Noida", availability: "Open", cashLevel: "Medium" },
  { id: "noida-hdfc-sec62", name: "HDFC ATM Sector 62", type: "atm", bank: "HDFC Bank", city: "Noida", lat: 28.6271, lng: 77.3649, address: "Sector 62, Noida", availability: "Busy", cashLevel: "Medium" },
  { id: "mumbai-sbi-bandra", name: "SBI Bandra Branch", type: "bank", bank: "State Bank of India", city: "Mumbai", lat: 19.0596, lng: 72.8295, address: "Bandra West, Mumbai", availability: "Open", cashLevel: "High" },
  { id: "mumbai-axis-lowerparel", name: "Axis ATM Lower Parel", type: "atm", bank: "Axis Bank", city: "Mumbai", lat: 18.9986, lng: 72.8244, address: "Lower Parel, Mumbai", availability: "Available", cashLevel: "High" },
  { id: "mumbai-kotak-andheri", name: "Kotak Andheri Branch", type: "bank", bank: "Kotak Mahindra Bank", city: "Mumbai", lat: 19.1176, lng: 72.8468, address: "Andheri East, Mumbai", availability: "Open", cashLevel: "Medium" },
  { id: "bangalore-icici-indiranagar", name: "ICICI Indiranagar Branch", type: "bank", bank: "ICICI Bank", city: "Bengaluru", lat: 12.9784, lng: 77.6408, address: "Indiranagar, Bengaluru", availability: "Open", cashLevel: "High" },
  { id: "bangalore-sbi-hsr", name: "SBI ATM HSR Layout", type: "atm", bank: "State Bank of India", city: "Bengaluru", lat: 12.9116, lng: 77.6474, address: "HSR Layout, Bengaluru", availability: "Busy", cashLevel: "Low" },
  { id: "bangalore-canara-koramangala", name: "Canara Koramangala Branch", type: "bank", bank: "Canara Bank", city: "Bengaluru", lat: 12.9352, lng: 77.6245, address: "Koramangala, Bengaluru", availability: "Open", cashLevel: "Medium" },
  { id: "pune-hdfc-hinjewadi", name: "HDFC ATM Hinjewadi", type: "atm", bank: "HDFC Bank", city: "Pune", lat: 18.5912, lng: 73.7389, address: "Hinjewadi Phase 1, Pune", availability: "Available", cashLevel: "High" },
  { id: "pune-bob-kothrud", name: "Bank of Baroda Kothrud", type: "bank", bank: "Bank of Baroda", city: "Pune", lat: 18.5074, lng: 73.8077, address: "Kothrud, Pune", availability: "Open", cashLevel: "Medium" },
  { id: "indore-sbi-palasia", name: "SBI Palasia Branch", type: "bank", bank: "State Bank of India", city: "Indore", lat: 22.7196, lng: 75.8577, address: "Palasia, Indore", availability: "Open", cashLevel: "High" },

{ id: "indore-hdfc-vijaynagar", name: "HDFC ATM Vijay Nagar", type: "atm", bank: "HDFC Bank", city: "Indore", lat: 22.7533, lng: 75.8937, address: "Vijay Nagar, Indore", availability: "Available", cashLevel: "Medium" },

{ id: "indore-icici-rajwada", name: "ICICI Rajwada Branch", type: "bank", bank: "ICICI Bank", city: "Indore", lat: 22.7177, lng: 75.8545, address: "Rajwada, Indore", availability: "Open", cashLevel: "High" },

{ id: "indore-axis-geetabhawan", name: "Axis ATM Geeta Bhawan", type: "atm", bank: "Axis Bank", city: "Indore", lat: 22.7076, lng: 75.8672, address: "Geeta Bhawan, Indore", availability: "Busy", cashLevel: "Low" },

{ id: "indore-pnb-annapurna", name: "PNB Annapurna Branch", type: "bank", bank: "Punjab National Bank", city: "Indore", lat: 22.6924, lng: 75.8507, address: "Annapurna Road, Indore", availability: "Open", cashLevel: "Medium" },

{ id: "indore-bob-bhawarkuan", name: "Bank of Baroda Bhawarkuan", type: "bank", bank: "Bank of Baroda", city: "Indore", lat: 22.6885, lng: 75.8413, address: "Bhawarkuan, Indore", availability: "Open", cashLevel: "High" },

{ id: "indore-kotak-bengali", name: "Kotak ATM Bengali Square", type: "atm", bank: "Kotak Mahindra Bank", city: "Indore", lat: 22.7281, lng: 75.8835, address: "Bengali Square, Indore", availability: "Available", cashLevel: "Medium" },

{ id: "indore-sbi-mgroad", name: "SBI MG Road Branch", type: "bank", bank: "State Bank of India", city: "Indore", lat: 22.7191, lng: 75.8572, address: "MG Road, Indore", availability: "Open", cashLevel: "High" },

{ id: "indore-hdfc-sapna", name: "HDFC ATM Sapna Sangeeta", type: "atm", bank: "HDFC Bank", city: "Indore", lat: 22.7013, lng: 75.8648, address: "Sapna Sangeeta, Indore", availability: "Busy", cashLevel: "Low" },

{ id: "indore-icici-tilak", name: "ICICI Tilak Nagar Branch", type: "bank", bank: "ICICI Bank", city: "Indore", lat: 22.7238, lng: 75.8892, address: "Tilak Nagar, Indore", availability: "Open", cashLevel: "Medium" },

{ id: "indore-axis-lig", name: "Axis ATM LIG Colony", type: "atm", bank: "Axis Bank", city: "Indore", lat: 22.7355, lng: 75.8723, address: "LIG Colony, Indore", availability: "Available", cashLevel: "High" },

{ id: "indore-pnb-bicholi", name: "PNB Bicholi Mardana Branch", type: "bank", bank: "Punjab National Bank", city: "Indore", lat: 22.7511, lng: 75.9102, address: "Bicholi Mardana, Indore", availability: "Open", cashLevel: "Medium" },

{ id: "indore-bob-sudama", name: "Bank of Baroda Sudama Nagar", type: "bank", bank: "Bank of Baroda", city: "Indore", lat: 22.6765, lng: 75.8341, address: "Sudama Nagar, Indore", availability: "Open", cashLevel: "High" },

{ id: "indore-kotak-scheme54", name: "Kotak ATM Scheme 54", type: "atm", bank: "Kotak Mahindra Bank", city: "Indore", lat: 22.7538, lng: 75.8899, address: "Scheme 54, Indore", availability: "Busy", cashLevel: "Medium" },

{ id: "indore-sbi-vijaynagar", name: "SBI Vijay Nagar Branch", type: "bank", bank: "State Bank of India", city: "Indore", lat: 22.7535, lng: 75.8932, address: "Vijay Nagar, Indore", availability: "Open", cashLevel: "High" },

{ id: "indore-hdfc-rajendra", name: "HDFC ATM Rajendra Nagar", type: "atm", bank: "HDFC Bank", city: "Indore", lat: 22.6701, lng: 75.8298, address: "Rajendra Nagar, Indore", availability: "Available", cashLevel: "Medium" },

{ id: "indore-icici-sapna", name: "ICICI Sapna Sangeeta", type: "bank", bank: "ICICI Bank", city: "Indore", lat: 22.7010, lng: 75.8650, address: "Sapna Sangeeta, Indore", availability: "Open", cashLevel: "High" },

{ id: "indore-axis-rajwada", name: "Axis ATM Rajwada", type: "atm", bank: "Axis Bank", city: "Indore", lat: 22.7175, lng: 75.8543, address: "Rajwada, Indore", availability: "Available", cashLevel: "High" },

{ id: "indore-pnb-vijaynagar", name: "PNB Vijay Nagar Branch", type: "bank", bank: "Punjab National Bank", city: "Indore", lat: 22.7540, lng: 75.8940, address: "Vijay Nagar, Indore", availability: "Open", cashLevel: "Medium" },

{ id: "indore-bob-palasia", name: "Bank of Baroda Palasia", type: "bank", bank: "Bank of Baroda", city: "Indore", lat: 22.7198, lng: 75.8580, address: "Palasia, Indore", availability: "Open", cashLevel: "High" },

{ id: "indore-aurobindo-sbi", name: "SBI ATM Aurobindo Hospital", type: "atm", bank: "State Bank of India", city: "Indore", lat: 22.7455, lng: 75.9066, address: "Near Aurobindo Hospital, Indore", availability: "Available", cashLevel: "High" },

{ id: "indore-aurobindo-hdfc", name: "HDFC ATM Aurobindo Square", type: "atm", bank: "HDFC Bank", city: "Indore", lat: 22.7448, lng: 75.9059, address: "Aurobindo Square, Indore", availability: "Busy", cashLevel: "Medium" },

{ id: "indore-aurobindo-icici", name: "ICICI Branch Aurobindo Nagar", type: "bank", bank: "ICICI Bank", city: "Indore", lat: 22.7462, lng: 75.9072, address: "Aurobindo Nagar, Indore", availability: "Open", cashLevel: "High" },

{ id: "indore-aurobindo-axis", name: "Axis ATM MR 10 Road", type: "atm", bank: "Axis Bank", city: "Indore", lat: 22.7470, lng: 75.9081, address: "MR 10 Road near Aurobindo, Indore", availability: "Available", cashLevel: "Medium" },

{ id: "indore-aurobindo-pnb", name: "PNB Branch Aurobindo Area", type: "bank", bank: "Punjab National Bank", city: "Indore", lat: 22.7459, lng: 75.9069, address: "Near Aurobindo Hospital, Indore", availability: "Open", cashLevel: "Medium" }
];

module.exports = { places };
