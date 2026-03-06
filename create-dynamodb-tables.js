const { DynamoDBClient, CreateTableCommand, ListTablesCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-1' });

const tables = [
  {
    TableName: 'ai-learning-users',
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'ai-learning-chat-history',
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'timestamp', AttributeType: 'N' }
    ],
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' },
      { AttributeName: 'timestamp', KeyType: 'RANGE' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'ai-learning-progress',
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'lessonId', AttributeType: 'S' }
    ],
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' },
      { AttributeName: 'lessonId', KeyType: 'RANGE' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  }
];

async function createTables() {
  console.log('🚀 Creating DynamoDB tables...\n');

  for (const tableConfig of tables) {
    try {
      console.log(`Creating table: ${tableConfig.TableName}...`);
      const command = new CreateTableCommand(tableConfig);
      await client.send(command);
      console.log(`✅ Table ${tableConfig.TableName} created successfully!\n`);
    } catch (error) {
      if (error.name === 'ResourceInUseException') {
        console.log(`⚠️  Table ${tableConfig.TableName} already exists\n`);
      } else {
        console.error(`❌ Error creating table ${tableConfig.TableName}:`, error.message, '\n');
      }
    }
  }

  // Wait a moment for tables to be created
  console.log('⏳ Waiting for tables to become active...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));

  // List all tables to verify
  console.log('📋 Listing all DynamoDB tables...');
  try {
    const listCommand = new ListTablesCommand({});
    const response = await client.send(listCommand);
    console.log('Tables:', response.TableNames);
    console.log('\n✨ DynamoDB setup complete!');
  } catch (error) {
    console.error('Error listing tables:', error.message);
  }
}

createTables().catch(console.error);
