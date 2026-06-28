package com.example.app1;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.text.InputType;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

public class NavigationAdapter extends RecyclerView.Adapter<NavigationAdapter.ViewHolder> {

    private final List<String> menuItems;
    private OnItemClickListener onItemClickListener;

    public NavigationAdapter(List<String> menuItems) {
        this.menuItems = menuItems;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(android.R.layout.simple_list_item_1, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        String item = menuItems.get(position);
        holder.textView.setText(item);

        holder.itemView.setOnClickListener(v -> {
            if (onItemClickListener != null) {
                onItemClickListener.onItemClick(position);
            }
        });
    }

    @Override
    public int getItemCount() {
        return menuItems.size();
    }

    public void setOnItemClickListener(OnItemClickListener listener) {
        this.onItemClickListener = listener;
    }

    public interface OnItemClickListener {
        void onItemClick(int position);
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView textView;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            textView = itemView.findViewById(android.R.id.text1);
        }
    }

    // This is the login screen
    public static class MainActivity extends Activity {

        private MediaPlayer mediaPlayer;

        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);

            // Initialize MediaPlayer with your audio file
            mediaPlayer = MediaPlayer.create(this, R.raw.song1);
            mediaPlayer.setLooping(true); // Set looping repeat
            mediaPlayer.start(); // Start playback

            // Set up the root layout
            LinearLayout rootLayout = new LinearLayout(this);
            rootLayout.setOrientation(LinearLayout.VERTICAL);
            rootLayout.setBackgroundColor(Color.parseColor("#121212"));
            rootLayout.setPadding(50, 100, 50, 100);

            // App Title
            TextView appTitle = new TextView(this);
            appTitle.setText("MitkademFlix");
            appTitle.setTextSize(TypedValue.COMPLEX_UNIT_SP, 42);
            appTitle.setTextColor(Color.WHITE);
            appTitle.setTextAlignment(View.TEXT_ALIGNMENT_CENTER);
            rootLayout.addView(appTitle);

            // Username Field
            EditText usernameInput = new EditText(this);
            usernameInput.setHint("Username");
            usernameInput.setHintTextColor(Color.GRAY);
            usernameInput.setTextColor(Color.WHITE);
            usernameInput.setBackgroundColor(Color.parseColor("#1F1F1F"));
            usernameInput.setPadding(20, 20, 20, 20);
            usernameInput.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
            rootLayout.addView(usernameInput);

            // Password Field
            EditText passwordInput = new EditText(this);
            passwordInput.setHint("Password");
            passwordInput.setHintTextColor(Color.GRAY);
            passwordInput.setTextColor(Color.WHITE);
            passwordInput.setBackgroundColor(Color.parseColor("#1F1F1F"));
            passwordInput.setPadding(20, 20, 20, 20);
            passwordInput.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
            passwordInput.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
            rootLayout.addView(passwordInput);

            // Login Button
            Button loginButton = new Button(this);
            loginButton.setText("Log In");
            loginButton.setTextSize(TypedValue.COMPLEX_UNIT_SP, 24);
            loginButton.setBackgroundColor(Color.parseColor("#E50914"));
            loginButton.setTextColor(Color.WHITE);
            loginButton.setPadding(20, 20, 20, 20);
            loginButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    // Simulate login and navigate to Home Screen
                    Intent intent = new Intent(MainActivity.this, HomeActivity.class);
                    startActivity(intent);
                }
            });
            rootLayout.addView(loginButton);

            // "New? Sign Up" Button
            Button signUpButton = new Button(this);
            signUpButton.setText("New? Sign Up");
            signUpButton.setTextSize(TypedValue.COMPLEX_UNIT_SP, 20);
            signUpButton.setBackgroundColor(Color.parseColor("#1F1F1F"));
            signUpButton.setTextColor(Color.WHITE);
            signUpButton.setPadding(20, 20, 20, 20);
            signUpButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    // Navigate to Sign Up Activity
                    Intent intent = new Intent(MainActivity.this, SignUpActivity.class);
                    startActivity(intent);
                }
            });
            rootLayout.addView(signUpButton);

            // Set the layout as the content view
            setContentView(R.layout.activity_loginactivity);
        }

        @Override
        protected void onDestroy() {
            super.onDestroy();
            // Release the MediaPlayer when the activity is destroyed
            if (mediaPlayer != null) {
                mediaPlayer.release();
            }
        }
    }
}
