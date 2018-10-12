package com.comolaestaviendo.charles.aiscontroller;

import android.provider.SyncStateContract;
import android.util.Log;
import java.io.*;
import java.net.InetAddress;
import java.net.Socket;

public class TcpClient {

    public static final String SERVER_IP =  "192.168.11.152";
    public static final int SERVER_PORT = 4444;

    private String serverMessage;

    private OnMessageReceived messageListener = null;
    private boolean clientRun = false;

    private PrintWriter bufferOut;
    private BufferedReader bufferIn;

    public TcpClient(OnMessageReceived listener) {
        messageListener = listener;
    }

    public void sendMessage(String message) {

        if (bufferOut != null && !bufferOut.checkError()) {
            bufferOut.println(message);
            bufferOut.flush();
        }
    }

    public void stopClient() {
        sendMessage("Connection closed.");

        clientRun = false;

        if (bufferOut != null) {
            bufferOut.flush();
            bufferOut.close();
        }

        messageListener = null;
        bufferIn = null;
        bufferOut = null;
        serverMessage = null;
    }

    public void run() {

        clientRun = true;

        try {
            InetAddress serverAddr = InetAddress.getByName(SERVER_IP);

            Log.e("TCP Client", "Connecting...");

            Socket socket = new Socket(serverAddr, SERVER_PORT);

            try {
                bufferOut = new PrintWriter(new BufferedWriter(new OutputStreamWriter(socket.getOutputStream())));
                bufferIn = new BufferedReader(new InputStreamReader(socket.getInputStream()));

                sendMessage("Connecting");

                while (clientRun) {
                    serverMessage = bufferIn.readLine();

                    if (serverMessage != null && messageListener != null) {
                        messageListener.messageReceived(serverMessage);
                    }
                }

                Log.e("RESPONSE FROM SERVER", "S: Received Message: '" + serverMessage + "'");

            } catch (Exception e) {

                Log.e("TCP", "S: Error", e);

            } finally {

                socket.close();
            }

        } catch (Exception e) {
            Log.e("TCP", "Error", e);
        }
    }

    public interface OnMessageReceived {
        public void messageReceived(String message);
    }
}
