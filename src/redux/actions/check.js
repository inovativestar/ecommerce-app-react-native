class Check {
  static user(user) {
    if (
      user.age !== null &&
      user.createat !== null &&
      user.description !== null &&
      user.device !== null &&
      user.drink !== null &&
      user.email !== null &&
      user.food !== null &&
      user.fullname !== null &&
      user.gender !== null &&
      user.job !== null &&
      user.nickname !== null &&
      user.objectid !== null &&
      user.password !== null &&
      user.phone !== null &&
      user.profile !== null &&
      user.score !== null &&
      user.token !== null &&
      user.type !== null &&
      user.updateat !== null) {
      return true;
    }
    console.log("check user false", user);
    return false;
  }

  static post(post) {
    if (
      post.addr !== null &&
      post.age !== null &&
      post.createat !== null &&
      post.date !== null &&
      post.day !== null &&
      post.description !== null &&
      post.gender !== null &&
      post.latitude !== null &&
      post.longitude !== null &&
      post.objectid !== null &&
      post.owner !== null &&
      post.ownername !== null &&
      post.ownerprofile !== null &&
      post.participation !== null &&
      post.photo !== null &&
      post.popular !== null &&
      post.score !== null &&
      post.state !== null &&
      post.title !== null &&
      post.type !== null &&
      post.updateat !== null) {
      return true;
    }
    console.log("check post false", post);
    return false;
  }

  static question(question) {
    if (
      question.objectid !== null &&
      question.userid !== null &&
      question.username !== null &&
      question.userthumb !== null &&
      question.title !== null &&
      question.description !== null &&
      question.answer !== null &&
      question.state !== null &&
      question.createat !== null &&
      question.updateat !== null) {
      return true;
    }
    console.log("check question false", question);
    return false;
  }

  static like(like) {
    if (
      like.state !== null &&
      like.user !== null &&
      like.username !== null &&
      like.userthumb !== null &&
      like.postid !== null &&
      like.postday !== null &&
      like.posttitle !== null &&
      like.posterid !== null &&
      like.postername !== null &&
      like.posterprofile !== null &&
      like.updateat !== null) {
      return true;
    }
    console.log("check like false", like);
    return false;
  }

  static message(message) {
    if (
      message._id !== null &&
      message.createat !== null &&
      message.createdAt !== null &&
      message.emoji !== null &&
      message.file !== null &&
      message.hash !== null &&
      message.image !== null &&
      message.objectid !== null &&
      message.posterid !== null &&
      message.postername !== null &&
      message.posterprofile !== null &&
      message.postid !== null &&
      message.posttitle !== null &&
      message.received !== null &&
      message.sent !== null &&
      message.sticker !== null &&
      message.text !== null &&
      message.type !== null &&
      message.updateat !== null &&
      message.user !== null) {
      /**
      if (message.user._id !== null && message.user.name !== null && message.user.avatar !== null){
        return true;
      } else {
        return false;
      }
      **/
      return true;
    }
    return false;
  }

  static recent(recent) {
    if (
      recent.createat !== null &&
      recent.day !== null &&
      recent.last !== null &&
      recent.lastdate !== null &&
      recent.posterid !== null &&
      recent.postername !== null &&
      recent.posterprofile !== null &&
      recent.postid !== null &&
      recent.posttitle !== null &&
      recent.unread !== null &&
      recent.updateat !== null) {
      return true;
    }
    return false;
  }

  static notification(notification) {
    if (
      notification.createat !== null &&
      notification.day !== null &&
      notification.objectid !== null &&
      notification.posterid !== null &&
      notification.postername !== null &&
      notification.posterthumb !== null &&
      notification.postid !== null &&
      notification.posttitle !== null &&
      notification.received !== null &&
      notification.sent !== null &&
      notification.state !== null &&
      notification.text !== null &&
      notification.updateat !== null &&
      notification.userid !== null &&
      notification.username !== null &&
      notification.userthumb !== null) {
      return true;
    }
    return false;
  }

  static feedback(feedback) {
    if (
      feedback.createat !== null &&
      feedback.description !== null &&
      feedback.image !== null &&
      feedback.level !== null &&
      feedback.postid !== null &&
      feedback.updateat !== null &&
      feedback.userid !== null &&
      feedback.username !== null &&
      feedback.userthumb !== null) {
      return true;
    }
    return false;
  }

  static official(official) {
    if (
      official.answer !== null &&
      official.createat !== null &&
      official.question !== null &&
      official.visit !== null) {
      return true;
    }
    /**
    if (official.answer !== null &&
        official.createat !== null &&
        official.date !== null &&
        official.objectid !== null &&
        official.question !== null &&
        official.updateat !== null &&
        official.visit !== null ){
        return true;
    }
    **/
    return false;
  }

  static matched(post, user) {
    if (this.post(post) && this.user(user)) {
      if (
        user.age >= post.age[0] &&
        user.age <= post.age[1] &&
        (user.gender === post.gender || post.gender === 2)) {
        return true;
      }
    }
    return false;
  }
}

export default Check;
