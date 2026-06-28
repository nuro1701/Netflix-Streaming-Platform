package com.example.app1;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.example.app1.adapters.CategoryAdapter;
import com.example.app1.adapters.MovieAdapter;
import com.example.app1.NetflixDB;
import com.example.app1.entities.Category;
import com.example.app1.entities.Movie;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import java.util.List;

public class ManagementActivity extends AppCompatActivity {

    private RecyclerView moviesRecyclerView, categoriesRecyclerView;
    private MovieAdapter movieAdapter;
    private CategoryAdapter categoryAdapter;
    private List<Movie> movies;
    private List<Category> categories;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_management);

        // Retrieve JWT token and validate admin access
        String jwtToken = getJwtToken();
        if (!isAdmin(jwtToken)) {
            Toast.makeText(this, "Access Denied", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        // Initialize UI elements
        moviesRecyclerView = findViewById(R.id.moviesRecyclerView);
        categoriesRecyclerView = findViewById(R.id.categoriesRecyclerView);
        FloatingActionButton addMovieButton = findViewById(R.id.addMovieButton);
        FloatingActionButton addCategoryButton = findViewById(R.id.addCategoryButton);

        setupRecyclerViews();

        // Add button listeners
        addMovieButton.setOnClickListener(v -> openAddMovieDialog());
        addCategoryButton.setOnClickListener(v -> openAddCategoryDialog());
    }

    private String getJwtToken() {
        SharedPreferences prefs = getSharedPreferences("AppPrefs", MODE_PRIVATE);
        return prefs.getString("jwt_token", null);
    }

    private boolean isAdmin(String token) {
        return token != null && token.contains("\"role\":\"admin\"");
    }

    private void setupRecyclerViews() {
        loadMovies();
        loadCategories();
    }

    private void loadMovies() {
        AsyncTask.execute(() -> {
            movies = NetflixDB.getInstance(getApplicationContext()).movieDAO().getAllMovies();
            runOnUiThread(() -> {
                movieAdapter = new MovieAdapter(movies, ManagementActivity.this);
                moviesRecyclerView.setAdapter(movieAdapter);
                moviesRecyclerView.setLayoutManager(new LinearLayoutManager(this));
            });
        });
    }

    private void loadCategories() {
        AsyncTask.execute(() -> {
            categories = NetflixDB.getInstance(getApplicationContext()).categoryDAO().getAllCategories();
            runOnUiThread(() -> {
                categoryAdapter = new CategoryAdapter(categories);
                categoriesRecyclerView.setAdapter(categoryAdapter);
                categoriesRecyclerView.setLayoutManager(new LinearLayoutManager(this));
            });
        });
    }

    private void openAddMovieDialog() {
        AddMovieDialog dialog = new AddMovieDialog(this);
        dialog.setOnMovieAddedListener(this::loadMovies);  // Set the listener to reload movies
        dialog.show();
    }

    private void openAddCategoryDialog() {
        AddCategoryDialog dialog = new AddCategoryDialog(this);
        dialog.setOnCategoryAddedListener(this::loadCategories);
        dialog.show();
    }
}
