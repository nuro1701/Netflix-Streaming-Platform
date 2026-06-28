package com.example.app1;

import android.app.Dialog;
import android.content.Context;
import android.os.AsyncTask;
import android.widget.Button;
import android.widget.EditText;
import com.example.app1.NetflixDB;
import com.example.app1.entities.Category;

public class AddCategoryDialog extends Dialog {

    public interface OnCategoryAddedListener {
        void onCategoryAdded();
    }

    private OnCategoryAddedListener listener;

    public AddCategoryDialog(Context context) {
        super(context);
        setContentView(R.layout.dialog_add_category);

        EditText categoryInput = findViewById(R.id.categoryInput);
        Button saveButton = findViewById(R.id.saveButton);

        saveButton.setOnClickListener(v -> {
            String categoryName = categoryInput.getText().toString();


            AsyncTask.execute(() -> {
                NetflixDB.getInstance(getContext()).categoryDAO().insertCategory(new Category(categoryName));

                if (listener != null) {
                    listener.onCategoryAdded();
                }
                dismiss();
            });
        });
    }

    public void setOnCategoryAddedListener(OnCategoryAddedListener listener) {
        this.listener = listener;
    }
}
