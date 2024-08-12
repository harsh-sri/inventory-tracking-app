import { Logger } from "@nestjs/common";
import { Kafka, Message, Producer } from "kafkajs";
import { IProducer } from "./producer.interface";
import { sleep } from "src/common/utils/sleep";

export class KafkajsProducer implements IProducer {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly logger: Logger;

  constructor(
    private readonly topic: string,
    broker: string,
  ) {
    this.kafka = new Kafka({
      clientId: "inventory-tracking-service",
      brokers: [broker || "my_kafka_container:9092"],
      requestTimeout: 30000,
    });
    this.producer = this.kafka.producer({ allowAutoTopicCreation: true });
    this.logger = new Logger(topic);
  }

  async produce(message: Message) {
    try {
      await this.producer.send({ topic: this.topic, messages: [message] });
      this.logger.log(`Message sent to topic ${this.topic}`);
    } catch (err) {
      this.logger.error(`Failed to send message to topic ${this.topic}`, err);
      throw err;
    }
  }

  async connect() {
    try {
      await this.producer.connect();
      this.logger.log(`Connected to Kafka broker for topic ${this.topic}`);
    } catch (err) {
      this.logger.error("Failed to connect to Kafka. Retrying...", err);
      await sleep(5000);
      await this.connect();
    }
  }

  async disconnect() {
    try {
      await this.producer.disconnect();
      this.logger.log(`Disconnected from Kafka broker for topic ${this.topic}`);
    } catch (err) {
      this.logger.error("Failed to disconnect from Kafka.", err);
    }
  }
}
