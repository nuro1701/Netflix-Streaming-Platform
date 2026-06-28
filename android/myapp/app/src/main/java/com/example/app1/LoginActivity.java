package com.example.app1;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import com.example.app1.api.ApiService;
import com.example.app1.api.RetrofitClient;
import com.example.app1.entities.Token;
import com.example.app1.entities.User;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {
    private EditText emailInput, passwordInput;
    private ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_loginactivity);

        emailInput = findViewById(R.id.usernameInput);
        passwordInput = findViewById(R.id.passwordInput);
        Button loginButton = findViewById(R.id.loginButton);

        apiService = RetrofitClient.getApiService();

        loginButton.setOnClickListener(v -> {
            Log.d("Log In", "Log In button clicked");
            loginUser();
        });

        // Navigate to SignUpActivity when clicking "Sign Up" button
        Button signUpButton = findViewById(R.id.signupButton);
        signUpButton.setOnClickListener(v -> {
            Intent intent = new Intent(LoginActivity.this, SignUpActivity.class);
            startActivity(intent);
        });

    }

    private void loginUser() {
        Log.d("Log In", "LoginUser function started");
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();

        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please enter email and password", Toast.LENGTH_SHORT)
                    .show();
            return;
        }

        apiService.login(new User(email, password)).enqueue(new Callback<Token>() {
            @Override
            public void onResponse(@NonNull Call<Token> call, @NonNull Response<Token> response) {
                navigateToMovieListActivity();
            }

            @Override
            public void onFailure(@NonNull Call<Token> call, @NonNull Throwable t) {
                Toast.makeText(LoginActivity.this, "Network Error", Toast.LENGTH_SHORT)
                        .show();
            }
        });
        Log.d("Log In", "LoginUser function finished");
    }

    private void navigateToMovieListActivity() {
        Log.d("Log In", "navigateToMovieListActivity function started");
        Intent intent = new Intent(this, MovieListActivity.class);
        startActivity(intent);
        finish();
        Log.d("Log In", "navigateToMovieListActivity function finished");
    }
}
