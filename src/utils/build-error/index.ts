class SQGError extends Error {
  constructor(message: string) {
    super(`Sequelize Query Generator Error: ${message}`);
  }
}

export { SQGError };
