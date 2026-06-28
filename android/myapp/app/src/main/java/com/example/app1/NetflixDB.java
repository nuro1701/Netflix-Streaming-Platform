package com.example.app1;

import android.content.Context;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

import com.example.app1.dao.CategoryDAO;
import com.example.app1.dao.MovieDAO;
import com.example.app1.dao.UserDAO;
import com.example.app1.entities.Category;
import com.example.app1.entities.Movie;
import com.example.app1.entities.User;

@Database(entities = {Movie.class, Category.class, User.class}, version = 1)
public abstract class NetflixDB extends RoomDatabase {

    private static volatile NetflixDB INSTANCE;

    public abstract MovieDAO movieDAO();
    public abstract CategoryDAO categoryDAO();
    public abstract UserDAO userDAO();

    public static NetflixDB getInstance(Context context) {
        if (INSTANCE == null) {
            synchronized (NetflixDB.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(context.getApplicationContext(),
                                    NetflixDB.class, "netflix_database")
                            .fallbackToDestructiveMigration()
                            .build();
                }
            }
        }
        return INSTANCE;
    }
}

