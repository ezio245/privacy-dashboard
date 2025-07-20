import asyncio
import json
import psutil
import websockets

# Note: GPU monitoring is complex and not included in this example.
# It would require vendor-specific tools like 'nvidia-smi' or 'rocm-smi'.

async def monitor(websocket, path):
    """Sends system performance data to the client every second."""
    print("Client connected to performance monitor.")
    try:
        while True:
            # Get CPU, memory, and disk usage
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            memory_percent = memory.percent
            disk = psutil.disk_usage('/')
            disk_percent = disk.percent
            
            # Get network I/O
            net_io = psutil.net_io_counters()
            
            # Prepare data payload
            data = {
                "cpu": cpu_percent,
                "memory": memory_percent,
                "disk": disk_percent,
                "network_sent": net_io.bytes_sent,
                "network_recv": net_io.bytes_recv
            }
            
            # Send data to the frontend
            await websocket.send(json.dumps(data))
            
            # The original interval is handled by cpu_percent, 
            # so we can reduce the sleep time here to make the server more responsive
            # to connection closes.
            await asyncio.sleep(0.1)
            
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected.")
    finally:
        print("Monitoring stopped for a client.")

async def main():
    """Sets up and runs the WebSocket server indefinitely."""
    # Use an asynchronous context manager to handle server startup and shutdown
    async with websockets.serve(monitor, "localhost", 8765):
        print("Performance monitoring server started on ws://localhost:8765")
        # Keep the server running forever
        await asyncio.Future()

if __name__ == "__main__":
    try:
        # Use asyncio.run() to start the application
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Server shut down manually.")


