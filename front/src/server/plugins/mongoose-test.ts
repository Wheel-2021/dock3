import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MealTypeSchema = new Schema({
  _id: Number,
  type: String,
});

const MealTypeModel = mongoose.model('MealType', MealTypeSchema);

const MealSchema = new Schema({
  type: { type: Number, ref: 'MealType' },
  foods: [
    {
      menu: String,
    },
  ],
});

const MealModel = mongoose.model('Meal', MealSchema);

var db;

const dbname = 'meal';
const config = useRuntimeConfig();

const connectDB = async () => {
  try {
    await mongoose.connect(config.apiSecret.MONGODB_URI`/${dbname }`);
    db = mongoose.connection;
    console.log(`Connected to database on Worker process: ${process.pid}`);
  } catch (error: any) {
    console.error(
      `Connection error: ${error.stack} on Worker process: ${process.pid}`
    );
    process.exit(1);
  }
};

const closeDB = async () => {
  console.log('closeDB called');
  await mongoose.disconnect;
  db = undefined;
};

mongoose.connection.on('connected', () => {
  console.log('connected');
});

mongoose.connection.on('error', (err) => {
  console.log('connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
  console.log('disconnected');
});

mongoose.connection.on('close', () => {
  console.log('connection closed');
});

export default async () => {
  try {
    await connectDB();
    var monday_morning = new MealModel({
      type: 1,
      foods: [{ menu: '目玉焼き' }, { menu: '牛乳' }, { menu: 'トースト' }],
    });

    await monday_morning.save();
    var monday_lunch = new MealModel({
      type: 2,
      foods: [{ menu: 'ナポリタン' }, { menu: 'アイスコーヒー' }],
    });

    await monday_lunch.save();

    var monday_dinner = new MealModel({
      type: 3,
      foods: [{ menu: '肉じゃが' }, { menu: '納豆' }, { menu: '味噌汁' }],
    });

    await monday_dinner.save();

    var thuesday_morning = new MealModel({
      type: 1,
      foods: [
        { menu: 'スクランブルエッグ' },
        { menu: '牛乳' },
        { menu: 'トースト' },
      ],
    });
    await thuesday_morning.save();

    console.log('朝食に食べたのを検索します');
    console.log('------------------');

    {
      const result = await MealModel.find({ type: 1 }).populate('type').exec();
      console.log(JSON.stringify(result, null, 2));
    }
    // 肉じゃががメニューに入っていたのを検索
    console.log('肉じゃががメニューに入っていたのを検索します');
    console.log('------------------');
    {
      const result = await MealModel.find({ 'foods.menu': '肉じゃが' })
        .populate('type')
        .exec();
      console.log(JSON.stringify(result, null, 2));
    }

    // トーストがメニューに入っていたのを検索
    console.log('トーストがメニューに入っていたのを検索します');
    console.log('------------------');
    {
      const result = await MealModel.find({ 'foods.menu': 'トースト' })
        .populate('type')
        .exec();
      console.log(JSON.stringify(result, null, 2));
    }

    // 牛乳 => オレンジジュースを入れ替え
    console.log('牛乳 => オレンジジュースを入れ替えします');
    console.log('------------------');
    {
      const result = await MealModel.updateMany(
        { 'foods.menu': '牛乳' },
        { $set: { 'foods.$.menu': 'オレンジジュース' } }
      );
      console.log(JSON.stringify(result, null, 2));
    }

    // 全コレクションをチェック
    console.log('全コレクションをチェックします');
    console.log('------------------');
    {
      const result = await MealModel.find().populate('type').exec();
      console.log(JSON.stringify(result, null, 2));
    }

    // 夕食の全データを削除
    console.log('夕食の全データを削除します');
    console.log('------------------');
    {
      const result = await MealModel.deleteMany({ type: 3 });
      console.log(JSON.stringify(result, null, 2));
    }

    // 全コレクションをチェック
    console.log('全コレクションをチェックします');
    console.log('------------------');
    {
      const result = await MealModel.find().populate('type').exec();
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (err) {
    console.error(err);
  } finally {
    await closeDB();
  }
};
