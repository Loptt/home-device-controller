package com.comolaestaviendo.charles.aiscontroller;

import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;

import java.util.ArrayList;

public class ClientActivity extends AppCompatActivity {

    private ListView listView;
    private ArrayList<String> arrayList;
    private ClientListAdapter adapter;
    private TcpClient tcpClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_client);

        arrayList = new ArrayList<String>();

        final EditText editText = (EditText) findViewById(R.id.editText);
        Button send = (Button) findViewById(R.id.send_button);

        listView = (ListView) findViewById(R.id.list);
        adapter = new ClientListAdapter(this, arrayList);
        listView.setAdapter(adapter);

        send.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String message = editText.getText().toString();

                arrayList.add("c: " + message);

                if (tcpClient != null) {
                    tcpClient.sendMessage(message);
                }

                adapter.notifyDataSetChanged();
                editText.setText("");
            }
        });
    }

    @Override
    protected void onPause() {
        super.onPause();
        tcpClient.stopClient();
        tcpClient = null;
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.main_menu, menu);

        return true;
    }

    @Override
    public boolean onPrepareOptionsMenu(Menu menu) {

        if (tcpClient != null) {
            menu.getItem(1).setEnabled(true);
            menu.getItem(0).setEnabled(false);
        } else {
            menu.getItem(1).setEnabled(false);
            menu.getItem(0).setEnabled(true);
        }

        return super.onPrepareOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        switch (item.getItemId()) {
            case R.id.connect:
                new ConnectTask().execute("");
                return true;

            case R.id.disconnect:
                tcpClient.stopClient();
                tcpClient = null;
                arrayList.clear();
                adapter.notifyDataSetChanged();
                return true;

                default:
                    return super.onOptionsItemSelected(item);
        }
    }

    public class ConnectTask extends AsyncTask<String, String, TcpClient> {

        @Override
        protected TcpClient doInBackground(String... message) {
            tcpClient = new TcpClient(new TcpClient.OnMessageReceived() {

                @Override
                public void messageReceived(String message) {
                    publishProgress(message);
                }
            });

            tcpClient.run();

            return null;
        }

        @Override
        protected void onProgressUpdate(String... values) {
            super.onProgressUpdate(values);

            arrayList.add(values[0]);
            adapter.notifyDataSetChanged();
        }
    }
}
