package com.comolaestaviendo.charles.aiscontroller;

import android.content.Context;
import android.support.constraint.solver.LinearSystem;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import java.util.ArrayList;

public class ClientListAdapter extends BaseAdapter {

    private ArrayList<String> listItems;
    private LayoutInflater layoutInflater;

    public ClientListAdapter(Context context, ArrayList<String> arrayList) {

        listItems = arrayList;
        layoutInflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    }

    @Override
    public int getCount() {
        return listItems.size();
    }

    @Override
    public Object getItem(int position) {
        return null;
    }

    @Override
    public long getItemId(int position) {
        return 0;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {

        if (convertView == null) {
            convertView = layoutInflater.inflate(R.layout.list_item, null);
        }

        String stringItem = listItems.get(position);

        if (stringItem != null) {
            TextView itemName = (TextView) convertView.findViewById(R.id.list_item_textView);

            if (itemName != null) {
                itemName.setText(stringItem);
            }
        }

        return convertView;
    }
}
