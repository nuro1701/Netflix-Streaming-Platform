package com.example.app1;

import android.app.Dialog;
import android.content.Context;
import android.os.AsyncTask;
import android.widget.Button;
import android.widget.EditText;
import com.example.app1.NetflixDB;
import com.example.app1.entities.Movie;

public class AddMovieDialog extends Dialog {

    public interface OnMovieAddedListener {
        void onMovieAdded();
    }

    private OnMovieAddedListener listener;

    public AddMovieDialog(Context context) {
        super(context);
        setContentView(R.layout.dialog_add_movie);

        EditText titleInput = findViewById(R.id.titleInput);
        EditText descInput = findViewById(R.id.descInput);
        Button saveButton = findViewById(R.id.saveButton);

        saveButton.setOnClickListener(v -> {
            String title = titleInput.getText().toString();
            String description = descInput.getText().toString();

            AsyncTask.execute(() -> {
                Movie newMovie = new Movie(title,2024,"Unknown","Unknown",
                        null, description,"","",0,0);
                NetflixDB.getInstance(getContext()).movieDAO().insertMovie(newMovie);
                if (listener != null) {
                    listener.onMovieAdded();
                }
                dismiss();
            });
        });

    }

    public void setOnMovieAddedListener(OnMovieAddedListener listener) {
        this.listener = listener;
    }
}
