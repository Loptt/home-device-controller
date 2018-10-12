package com.comolaestaviendo.charles;

import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class MainScreen extends JFrame {

    private JTextArea messageArea;
    private JButton sendButton;
    private JTextField message;
    private JButton startServer;
    private JButton stopServer;
    private TcpServer server;

    public MainScreen() {
        super("MainScreen");

        JPanel panelFields = new JPanel();
        panelFields.setLayout(new BoxLayout(panelFields, BoxLayout.X_AXIS));

        JPanel panelFields2 = new JPanel();
        panelFields2.setLayout(new BoxLayout(panelFields2, BoxLayout.X_AXIS));

        messageArea = new JTextArea();
        messageArea.setColumns(30);
        messageArea.setRows(10);

        sendButton = new JButton("Send");
        sendButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {

                String messageText = message.getText();
                messageArea.append("\n" + messageText);
            }
        });
    }
}
