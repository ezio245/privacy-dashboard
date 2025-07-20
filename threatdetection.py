import os
import pandas as pd
import tensorflow as tf
import ipaddress
from scapy.all import sniff, IP, TCP, Raw, get_if_list
from datetime import datetime

# Load the trained model
try:
    model = tf.keras.models.load_model('contextaware_model3.keras')
except Exception as e:
    print(f"Error loading model: {e}")
    exit(1)

def ip_to_int(ip):
    """Convert an IP address to an integer."""
    try:
        return int(ipaddress.ip_address(ip))
    except ValueError as e:
        print(f"Error converting IP address {ip} to integer: {e}")
        return 0

def preprocess_traffic_data(df):
    """Preprocess the packet data for model prediction."""
    df['laddr_ip'] = df['laddr_ip'].apply(ip_to_int)
    df['raddr_ip'] = df['raddr_ip'].apply(ip_to_int)
    df['status'] = df['status'].astype('category').cat.codes
    
    expected_features = 14  # Expected number of features for the model
    df_numeric = df[['laddr_ip', 'laddr_port', 'raddr_ip', 'raddr_port', 'status']]
    
    # Adjust the DataFrame to ensure it has the expected number of features
    additional_features = expected_features - df_numeric.shape[1]
    if additional_features > 0:
        df_numeric = pd.concat([df_numeric, pd.DataFrame(0, index=df_numeric.index, columns=range(additional_features))], axis=1)
    else:
        df_numeric = df_numeric.iloc[:, :expected_features]
    
    return df_numeric

def classify_traffic(pkt):
    """Classify network traffic based on captured packets."""
    if IP in pkt:
        src_ip = pkt[IP].src
        dst_ip = pkt[IP].dst
        src_port = pkt[TCP].sport if TCP in pkt else 0
        dst_port = pkt[TCP].dport if TCP in pkt else 0

        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        payload = pkt[Raw].load.decode(errors='ignore') if Raw in pkt else ''

        # Prepare data for prediction
        data = {
            'laddr_ip': [src_ip],
            'laddr_port': [src_port],
            'raddr_ip': [dst_ip],
            'raddr_port': [dst_port],
            'status': ['active'],
            'timestamp': [timestamp],
            'payload': [payload]
        }

        df = pd.DataFrame(data)
        X = preprocess_traffic_data(df)

        if X.shape[1] != 14:
            print(f"Expected 14 features, but got {X.shape[1]}")
            return

        # Make prediction
        try:
            predictions = model.predict(X)
            prediction_label = 'Malicious' if predictions[0] > 0.5 else 'Normal'
            print(f"Packet captured: {timestamp}, {src_ip}:{src_port} -> {dst_ip}:{dst_port}, Prediction: {prediction_label}")
            print(f"Payload: {payload}")
            print("-" * 50)
        except Exception as e:
            print(f"Error during prediction: {e}")

def main():
    interfaces = get_if_list()
    print("Network interfaces:", interfaces)

    for interface in interfaces:
        print(f"Sniffing packets on interface: {interface}...")
        try:
            # Start sniffing packets and processing them in real-time
            sniff(iface=interface, prn=classify_traffic, store=0)  # store=0 to avoid storing packets in memory
        except KeyboardInterrupt:
            print("Stopping packet capture.")
            break
        except Exception as e:
            print(f"Error occurred: {e}")

if __name__ == "__main__":
    main()