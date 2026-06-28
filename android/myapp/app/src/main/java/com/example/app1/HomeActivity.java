package com.example.app1;

import android.media.MediaPlayer;
import android.os.Bundle;
import android.widget.GridLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;
import java.util.List;

public class HomeActivity extends AppCompatActivity {

    private DrawerLayout drawerLayout;
    private RecyclerView navigationMenu;
    private ActionBarDrawerToggle drawerToggle;

    private MediaPlayer mediaPlayer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_homeactivity);

        mediaPlayer = MediaPlayer.create(this, R.raw.song3);
        mediaPlayer.setLooping(true); // Set looping repeat
        mediaPlayer.start();

        // Set up the toolbar
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        // Initialize DrawerLayout
        drawerLayout = findViewById(R.id.drawerLayout);

        // Set up navigation menu RecyclerView
        navigationMenu = findViewById(R.id.navigationMenu);
        navigationMenu.setLayoutManager(new LinearLayoutManager(this));
        setupNavigationMenu();

        // Set up Drawer Toggle
        drawerToggle = new ActionBarDrawerToggle(
                this, drawerLayout, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawerLayout.addDrawerListener(drawerToggle);
        drawerToggle.syncState();

        // Populate the movie categories
        populateMovieGrids();
    }

    private void setupNavigationMenu() {
        List<String> menuItems = new ArrayList<>();
        menuItems.add("Home");
        menuItems.add("My Account");
        menuItems.add("Settings");
        menuItems.add("Logout");

        NavigationAdapter adapter = new NavigationAdapter(menuItems);
        navigationMenu.setAdapter(adapter);

        adapter.setOnItemClickListener(position -> {
            String selectedItem = menuItems.get(position);
            // Handle menu item clicks
            drawerLayout.closeDrawer(GravityCompat.START);
            // Example: Handle clicks
            if (selectedItem.equals("Home")) {
                // Navigate to Home
            } else if (selectedItem.equals("Settings")) {
                // Navigate to Settings
            }
        });
    }

    private void populateMovieGrids() {
        GridLayout movieGridFavorites = findViewById(R.id.movieGridFavorites);
        GridLayout movieGridRecommended = findViewById(R.id.movieGridRecommended);
        GridLayout movieGridCategory1 = findViewById(R.id.movieGridCategory1);
        GridLayout movieGridCategory2 = findViewById(R.id.movieGridCategory2);

        // Dynamically add items to each category (same as in your previous logic)
        for (int i = 1; i <= 10; i++) {
            addMovieToGrid(movieGridFavorites, "Movie " + i);
        }
        for (int i = 11; i <= 20; i++) {
            addMovieToGrid(movieGridRecommended, "Movie " + i);
        }
        for (int i = 21; i <= 30; i++) {
            addMovieToGrid(movieGridCategory1, "Movie " + i);
        }
        for (int i = 31; i <= 40; i++) {
            addMovieToGrid(movieGridCategory2, "Movie " + i);
        }
    }


    private void addMovieToGrid(GridLayout grid, String movieTitleText) {
        LinearLayout movieLayout = new LinearLayout(this);
        movieLayout.setOrientation(LinearLayout.VERTICAL);
        movieLayout.setPadding(8, 8, 5, 8);

        ImageView moviePoster = new ImageView(this);
        moviePoster.setImageDrawable(ContextCompat.getDrawable(this, R.drawable.movie_poster_placeholder));
        moviePoster.setScaleType(ImageView.ScaleType.CENTER_CROP);
        movieLayout.addView(moviePoster);

        TextView movieTitle = new TextView(this);
        movieTitle.setText(movieTitleText);
        movieTitle.setTextColor(ContextCompat.getColor(this, android.R.color.system_on_tertiary_light));
        movieTitle.setTextSize(25);
        movieTitle.setGravity(TextView.TEXT_ALIGNMENT_CENTER);
        movieTitle.setPadding(0, 5, 0, 0);
        movieLayout.addView(movieTitle);

        grid.addView(movieLayout);
    }
}
