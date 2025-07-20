import psutil
import time
import pandas as pd
import numpy as np
from tensorflow.keras.models import load_model
from sklearn.preprocessing import StandardScaler

# Load your pre-trained ML model
loaded_model = load_model('traffic_detection.keras')

# StandardScaler to preprocess features (assuming same as used in training)
scaler = StandardScaler()

# Monitor basic network traffic statistics (sent and received bytes)
def monitor_network_traffic(interval=5):
    # Get initial network stats
    initial_net_io = psutil.net_io_counters(pernic=True)
    
    # Wait for the defined interval
    time.sleep(interval)
    
    # Get network stats after the interval
    final_net_io = psutil.net_io_counters(pernic=True)
    
    # Calculate traffic differences (basic features)
    traffic_data = []
    
    for iface in initial_net_io:
        sent_diff = final_net_io[iface].bytes_sent - initial_net_io[iface].bytes_sent
        recv_diff = final_net_io[iface].bytes_recv - initial_net_io[iface].bytes_recv
        total_diff = sent_diff + recv_diff
        
        # Ensure we have the correct number of features
        features = [
            sent_diff,  # Feature 1
            recv_diff,  # Feature 2
            total_diff, # Feature 3
            total_diff / interval,  # Feature 4: Bytes/s
            0,          # Placeholder for additional features (5)
            0,          # Placeholder (6)
            0,          # Placeholder (7)
            0,          # Placeholder (8)
            0,          # Placeholder (9)
            0,          # Placeholder (10)
            0,          # Placeholder (11)
            0,          # Placeholder (12)
            0,          # Placeholder (13)
            0           # Placeholder (14)
        ]
        
        traffic_data.append((iface, features))
    
    return traffic_data

# Preprocess traffic data for the ML model
def preprocess_traffic(features_df):
    # Scale the features
    scaled_features = scaler.fit_transform(features_df)
    return scaled_features

# Predict the traffic status (High/Low) using the trained ML model
def predict_traffic(features):
    predictions = loaded_model.predict(features)
    predicted_labels = ['High Traffic' if p > 0.5 else 'Low Traffic' for p in predictions]
    return predicted_labels

# Monitor and predict traffic on each network interface
def monitor_and_predict(interval=5):
    while True:
        traffic_data = monitor_network_traffic(interval)
        
        # Convert the traffic data into a DataFrame with correct features
        traffic_df = pd.DataFrame([features for _, features in traffic_data])
        
        if not traffic_df.empty:
            # Preprocess the data for model input
            preprocessed_features = preprocess_traffic(traffic_df)
            
            # Make predictions
            predictions = predict_traffic(preprocessed_features)
            
            # Display predictions for each interface
            for i, (iface, _) in enumerate(traffic_data):
                print(f"Interface: {iface}")
                print(f"  Traffic Prediction: {predictions[i]}")
                print("------------------------------")
        else:
            print("No traffic data captured.")
        
        time.sleep(interval)

if __name__ == '__main__':
    monitor_and_predict(5)  # Monitor and predict every 5 seconds