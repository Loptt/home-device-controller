package com.comolaestaviendo.charles;

import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class TcpServer extends Thread {

    public static final int SERVERPORT = 4444;
    public boolean running = false;

    private PrintWriter bufferSender;
    private OnMessageReceived messageListener;
    private ServerSocket serverSocket;
    private Socket client;

    public TcpServer(OnMessageReceived messageListener) {
        this.messageListener = messageListener;
    }

    public static void main(String[] args) {

    }

    public interface OnMessageReceived {
        public void messageReceived(String message);
    }
}
