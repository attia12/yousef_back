package com.example.Task_Management.config;

import com.pusher.rest.Pusher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration

public class PusherConfig {
    @Bean
    public Pusher pusher() {
        Pusher pusher = new Pusher("1882360", "ada21c1898354865ff46", "4cf7a4b64e87f06891f2");
        pusher.setCluster("eu");
        pusher.setEncrypted(true);
        return pusher;
    }
}
