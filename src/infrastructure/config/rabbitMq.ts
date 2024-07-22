import config from "./index";

interface RabbitMQClient{
    rabbitMQ: {
        url: string;
        queues: {
            messageQueue:'message_queue'
        };
    };
}

const rabbitmqConfig: RabbitMQClient={
    rabbitMQ: {
        url: config.rabbitMq_url,
        queues: {
            messageQueue:'message_queue'
        }
    }
}

export default rabbitmqConfig;