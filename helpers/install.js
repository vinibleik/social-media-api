const User = require("../models/userModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");

let usersData = [
  {
    email: "admin@admin.com",
    password: "adminpassword",
    role: "admin",
    name: "admin",
    age: 30,
    likedPosts: [],
  },
  {
    email: "user@user.com",
    password: "userpassord",
    role: "user",
    name: "user",
    age: 20,
    likedPosts: [],
  },
  {
    email: "test@user.com",
    password: "testpassword",
    role: "user",
    name: "another user",
    likedPosts: [],
  },
  {
    email: "midadmin@admin.com",
    password: "midadminpassword",
    role: "admin",
    age: 25,
    likedPosts: [],
  },
  {
    email: "minimalUser@user.com",
    password: "minimalpassword",
  },
];

let postsData = [
  {
    title: "",
    author: "",
    body: "tempor nec feugiat nisl pretium fusce id velit ut tortor pretium viverra suspendisse potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi lacus sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras eget arcu dictum  ullamcorper morbi tincidunt ornare massa eget egestas purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae auctor eu augue ut lectus arcu bibendum at varius vel",
    themes: ["lorem", "data", "admin", "user", "all", "time"],
  },
  {
    title: "",
    author: "",
    body: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti excepturi est officiis laboriosam fugiat aliquam eius obcaecati possimus, asperiores nisi?",
    themes: ["lorem", "data", "comments", "post"],
  },
  {
    title: "",
    author: "",
    body: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima temporibus reiciendis commodi aut cum cupiditate doloremque, quis vitae ab ea facere corrupti maiores, quaerat architecto nemo voluptas voluptatem saepe at cumque? Ab dolores impedit aliquam veritatis possimus eum, sunt aut modi? Dolorem, magnam? Sapiente ducimus sunt cumque voluptas modi laborum.",
    themes: ["time", "data", "user"],
  },
  {
    title: "",
    author: "",
    body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia, doloribus? Est nihil repudiandae aliquid tempore natus sapiente cumque? Vitae quam veritatis odit accusamus laborum cumque temporibus officia magni natus necessitatibus!",
    themes: ["all"],
  },
  {
    title: "",
    author: "",
    body: "Lorem ipsum dolor sit amet.",
    themes: ["admin", "time", "lorem", "data"],
  },
  {
    title: "",
    author: "",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam eum aliquid odio. Itaque, iure cupiditate.",
  },
  {
    title: "",
    author: "",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit culpa veritatis nostrum eius. Assumenda quis debitis modi consequuntur, inventore esse nihil natus maxime molestiae at fugiat magnam dignissimos obcaecati ex.",
    themes: ["world", "here", "time"],
  },
  {
    title: "",
    author: "",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur quibusdam perspiciatis commodi nobis, omnis id veritatis quae quam in maxime eius, fugiat eligendi tempora dignissimos molestiae nulla rem ea expedita, ullam cum facilis. Cumque soluta, quibusdam laudantium maiores dignissimos quod ab rerum magnam. Consectetur totam non quasi deserunt obcaecati minima quas.",
    themes: ["data", "user", "admin"],
  },
  {
    title: "",
    author: "",
    body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    themes: ["gg"],
  },
  {
    title: "",
    author: "",
    body: "Lorem.",
  },
];

let commentsData = [
  {
    post: "",
    author: "",
    body: "Lorem ipsum, dolor sit amet consectetur elit. Tenetur accusantium omnis nesciunt odio ut dolorem.",
  },
  {
    post: "",
    author: "",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    post: "",
    author: "",
    body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore dolorem eum quaerat.",
  },
  {
    post: "",
    author: "",
    body: "Lorem, ipsum.",
  },
  {
    post: "",
    author: "",
    body: "Lorem ipsum dolor sit amet.",
  },
  {
    post: "",
    author: "",
    body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo, quod natus!",
  },
  {
    post: "",
    author: "",
    body: "Lorem ipsum, dolor sit amet. Aperiam neque aliquid non voluptatem illum, animi quos voluptate.",
  },
  {
    post: "",
    author: "",
    body: "Lorem ipsum dolor sit.",
  },
  {
    post: "",
    author: "",
    body: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
  },
  {
    post: "",
    author: "",
    body: "Lorem.",
  },
  {
    post: "",
    author: "",
    body: "Lorem ipsum dolor sit amet.",
  },
  {
    post: "",
    author: "",
    body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint, voluptas deserunt.",
  },
  {
    post: "",
    author: "",
    body: "Lorem, ipsum dolor.",
  },
  {
    post: "",
    author: "",
    body: "Lorem ipsum dolor sit.",
  },
  {
    post: "",
    author: "",
    body: "Lorem ipsum dolor sit amet consectetur.",
  },
  {
    post: "",
    author: "",
    body: "Lorem, ipsum dolor sit amet consectetur adipisicing.",
  },
  {
    post: "",
    author: "",
    body: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corporis odit nihil quo vitae illo.",
  },
  {
    post: "",
    author: "",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, ut.",
  },
  {
    post: "",
    author: "",
    body: "Lorem, ipsum.",
  },
  {
    post: "",
    author: "",
    body: "Lorem ipsum dolor sit adipisicing elit. Sunt delectus molestias optio voluptates ?",
  },
];

const randomNumber = (max, min) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const populateDB = async (req, res) => {
  try {
    let users = await User.create(usersData);

    postsData.forEach((element, index) => {
      element.title = `Post Title #${index}`;
      element.author = users[randomNumber(users.length, 0)].id;
    });

    let posts = await Post.create(postsData);

    commentsData.forEach((element) => {
      element.post = posts[randomNumber(posts.length, 0)].id;
      element.author = users[randomNumber(users.length, 0)].id;
    });

    let comments = await Comment.create(commentsData);

    return res.status(200).json({
      status: true,
      message: "Database successfully populated",
      nUserCreated: users.length,
      nPostsCreated: posts.length,
      nCommentsCreated: comments.length,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: false, error: "Database is already populated!" });
  }
};

module.exports = populateDB;
