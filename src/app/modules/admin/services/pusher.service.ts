import { Injectable } from '@angular/core';
import Pusher from "pusher-js";

@Injectable({
  providedIn: 'root'
})
export class PusherService {

  private pusher: Pusher;

  constructor() {
    this.pusher = new Pusher('ada21c1898354865ff46', {
      cluster: 'eu',
    });
  }

  getChannel(channelName: string) {
    return this.pusher.subscribe(channelName);
  }
}
