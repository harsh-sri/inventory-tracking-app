import { Kafka } from "kafkajs";
import { KafkajsProducer } from "./kafkajs.producer";

jest.mock("kafkajs");

describe("KafkajsProducer", () => {
  let kafkajsProducer;
  const topic = "kafkajs-test-topic";
  const broker = "kafka-broker";
  const message = { value: "message" };

  beforeEach(() => {
    kafkajsProducer = new KafkajsProducer(topic, broker);
    kafkajsProducer.producer = {
      send: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize Kafka, Producer, and Logger correctly", () => {
    expect(Kafka).toHaveBeenCalledWith({
      brokers: [broker],
      clientId: "inventory-tracking-service",
      requestTimeout: 30000,
    });
    expect(kafkajsProducer.producer).toBeDefined();
  });

  it("should send a message", async () => {
    let error;
    try {
      await kafkajsProducer.produce(message);
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeUndefined();
      expect(kafkajsProducer.producer.send).toHaveBeenCalledWith({
        topic,
        messages: [message],
      });
    }
  });

  it("should connect to the producer", async () => {
    let error;
    try {
      await kafkajsProducer.connect();
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeUndefined();
      expect(kafkajsProducer.producer.connect).toHaveBeenCalled();
    }
  });

  it("should disconnect from the producer", async () => {
    let error;
    try {
      await kafkajsProducer.disconnect();
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeUndefined();
      expect(kafkajsProducer.producer.disconnect).toHaveBeenCalled();
    }
  });
});
