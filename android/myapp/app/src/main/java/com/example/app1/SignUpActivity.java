package com.example.app1;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.widget.*;
import androidx.annotation.NonNull;
import okhttp3.*;
import org.json.JSONObject;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.regex.Pattern;

public class SignUpActivity extends Activity {
    private EditText firstNameInput, lastNameInput, emailInput, passwordInput, repeatPasswordInput;
    private CheckBox termsCheckbox;
    private static final String BASE_URL = "http://10.0.2.2:8080";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signupactivity);

        firstNameInput = findViewById(R.id.firstnameInput);
        lastNameInput = findViewById(R.id.lastnameInput);
        emailInput = findViewById(R.id.emailInput);
        passwordInput = findViewById(R.id.passwordInput);
        repeatPasswordInput = findViewById(R.id.repeatPasswordInput);
        termsCheckbox = findViewById(R.id.termsCheckbox);

        Button signUpButton = findViewById(R.id.signUpButton);
        signUpButton.setOnClickListener(v -> {
            Log.d("SignUp", "Sign up button clicked");
            sendSignUpRequest();
        });

    }

    private void sendSignUpRequest() {
        Log.d("SignUp", "sendSignUpRequest triggered");

        String firstname = firstNameInput.getText().toString().trim();
        String lastname = lastNameInput.getText().toString().trim();
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();
        String repeatPassword = repeatPasswordInput.getText().toString().trim();

        if (firstname.isEmpty() || lastname.isEmpty() || email.isEmpty() ||
                password.isEmpty() || repeatPassword.isEmpty()) {
            Log.d("SignUp", "One or more fields are empty");
            showToast("All fields are required!");
            return;
        }

        if (!termsCheckbox.isChecked()) {
            showToast("You must agree to the terms and conditions.");
            return;
        }

        if (!password.equals(repeatPassword)) {
            showToast("Passwords do not match!");
            return;
        }

        Log.d("SignUp", "sendSignUpRequest finished");

        sendSignUpData(firstname, lastname, email, password);
    }

    private void sendSignUpData(String firstname, String lastname, String email, String password) {
        Log.d("SignUp", "you are in the sendSignUpData function");
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("firstName", firstname);
            jsonObject.put("lastName", lastname);
            jsonObject.put("mail", email);
            jsonObject.put("password", password);

        } catch (Exception e) {
            showToast("Error creating JSON request.");
            return;
        }

        Log.d("SignUp", "creating JSON object succeed");

        RequestBody requestBody = RequestBody.create(
                MediaType.parse("application/json"), jsonObject.toString());
        Request request = new Request.Builder()
                .url(BASE_URL + "/users")
                .post(requestBody)
                .build();

        Log.d("SignUp", "create request succeed");

        new OkHttpClient().newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                runOnUiThread(() -> showToast("Network error: " + e.getMessage()));
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response)
                    throws IOException {
                Log.d("SignUp", "Response code: " + response.code());
                if (response.code() == 400) {
                    runOnUiThread(() -> showToast("Email already exists"));
                } else if (response.code() == 201) { // Created
                    runOnUiThread(() -> {
                        showToast("Sign Up Successful!");
                        startActivity(new Intent(SignUpActivity.this,
                                LoginActivity.class));
                        finish();
                    });
                } else {
                    runOnUiThread(() -> showToast("Sign-up failed"));
                }
            }
        });
    }

    private void showToast(String message) {
        runOnUiThread(() -> Toast.makeText(SignUpActivity.this, message,
                Toast.LENGTH_SHORT).show());
    }
}
