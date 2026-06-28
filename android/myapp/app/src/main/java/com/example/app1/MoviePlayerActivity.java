package com.example.app1;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.MediaItem;
import com.google.android.exoplayer2.ui.PlayerView;
import com.example.app1.R;

public class MoviePlayerActivity extends AppCompatActivity {

    private ExoPlayer player;
    private PlayerView playerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.movie_player_activity);

        playerView = findViewById(R.id.playerView);

        // Get movie details from the Intent
        String movieTitle = getIntent().getStringExtra("movie_title");
        if (movieTitle == null) {
            movieTitle = "Unknown Title";
        }
        String movieUrl = getIntent().getStringExtra("movie_url");
        if (movieUrl == null) {
            movieUrl = "";
        }

        // Display the movie title
        TextView titleText = findViewById(R.id.titleText);
        titleText.setText(movieTitle);

        initializePlayer(movieUrl);
    }


    private void initializePlayer(String videoUrl) {
        player = new ExoPlayer.Builder(this).build();
        playerView.setPlayer(player);

        MediaItem mediaItem = MediaItem.fromUri(Uri.parse(videoUrl));
        player.setMediaItem(mediaItem);

        player.prepare();
        player.setPlayWhenReady(true);
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (player != null) {
            player.pause();
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        if (player != null) {
            player.release();
        }
    }
}


