package com.example.app1;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.InputType;
import android.util.*;
import android.view.View;
import android.widget.*;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

// This is the login screen
public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_loginactivity);

        setSignupButton();

        setSignInButton();
    }

    private void setSignInButton() {
        Button loginButton = findViewById(R.id.loginButton);
        loginButton.setOnClickListener(v -> {

            EditText usernameInput = findViewById(R.id.usernameInput);
            EditText passwordInput = findViewById(R.id.passwordInput);

            String username = usernameInput.getText().toString().trim();
            String password = passwordInput.getText().toString().trim();

            if (username.isEmpty() || password.isEmpty()) {
                if (username.isEmpty() && password.isEmpty()) {
                    Toast.makeText(MainActivity.this, "Please enter username and password", Toast.LENGTH_SHORT).show();
                } else if (username.isEmpty()) {
                    Toast.makeText(MainActivity.this, "Please enter username", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(MainActivity.this, "Please enter password", Toast.LENGTH_SHORT).show();
                }
                return;
            }

            // Build JSON data
            String jsonData = "{\"username\": \"" + username + "\", \"password\": \"" + password + "\"}";
            Log.d("MainActivity", "Sending data to server: " + jsonData);
/*
            // Send data to server using HttpClient
            HttpClient.sendData("users", jsonData, response -> {
                runOnUiThread(() -> {
                    if (response != null) {
                        Log.d("MainActivity", "Response received from server: " + response);
                        if (response.contains("login success")) {
                            Toast.makeText(MainActivity.this, "Login successful!", Toast.LENGTH_SHORT).show();
                            Intent intent = new Intent(MainActivity.this, HomeActivity.class);
                            onDestroy();
                            startActivity(intent);
                        } else {
                            Toast.makeText(MainActivity.this, "Invalid username or password!", Toast.LENGTH_SHORT).show();
                        }
                    } else {
                        Log.e("MainActivity", "No response from server");
                        Toast.makeText(MainActivity.this, "Server error. Please try again later.", Toast.LENGTH_SHORT).show();
                    }
                });
            });
            */
        });
    }

    private void setSignupButton() {
        Button signupButton = findViewById(R.id.signupButton);

        signupButton.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, SignUpActivity.class);
            onDestroy();
            startActivity(intent); // Start the new activity
        });
    }
}
