import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { Message } from "kafkajs";
import { KafkajsProducer } from "./kafkajs.producer";
import { IProducer } from "./producer.interface";
import { ConfigService } from "src/core";

@Injectable()
export class ProducerService implements OnApplicationShutdown {
  private readonly producers = new Map<string, IProducer>();

  constructor(private readonly configService: ConfigService) {}

  async produce(topic: string, message: Message) {
    const producer = await this.getProducer(topic);
    await producer.produce(message);
  }

  private async getProducer(topic: string) {
    let producer = this.producers.get(topic);
    const { broker, clientId, timeout } = this.configService.kafka;

    if (!producer) {
      producer = new KafkajsProducer(topic, broker, clientId, timeout);
      await producer.connect();
      this.producers.set(topic, producer);
    }
    return producer;
  }

  async onApplicationShutdown() {
    for (const producer of this.producers.values()) {
      await producer.disconnect();
    }
  }
}
