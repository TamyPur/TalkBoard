import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Forum } from 'src/schemas/forum.schema';
import { UserService } from 'src/user/user.service';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService
    , private readonly userService: UserService
  ) { }

  public async sendMail(forum: Forum, auth: string) {
    const currentUser = this.userService.getCurrentUser(auth);
    try {
      let admin: User | PromiseLike<User>
      for (let i in forum.usersList) {
        const user = this.userService.getUserByEmail(forum.usersList[i]);
        let name: string
        if ((await user)) {
          name = (await user).name;
          if ((await user)._id = forum.admin)
            admin = (await user);
        }
        else
          name = "" + forum.usersList[i];
        this.mailerService.sendMail({
          to: forum.usersList[i],
          from: 'talkboard434@gmail.com',
          subject: 'צורפת לפורום ' + forum.subject,
          html:
           `<h2 style="text-align: center;">הי <strong>${name}</strong>,</h2>
        <p style="text-align: center;">הצטרפת בהצלחה לפורום <strong>${forum.subject}</strong> &nbsp;ע"י <strong>${(await currentUser).name}</strong></p>
        <p style="text-align: center;">נשמח לראותך משתמש &nbsp;פעיל בפורום.</p>
        <p style="text-align: center;">את/ה מוזמן/ת להצטרף לקהילת המשתמשים שלנו,</p>
        <p style="text-align: center;">ולהנות ממגוון השירותים שהפלטפורמה מעמידה לרשותך</p>
        <p style="text-align: center;">&nbsp;</p>
        <p style="text-align: center;"><a href="http://127.0.0.1:5173/">TalkBoard</a>לינק לאתר </p>
        <p style="text-align: center;"><img style="width: 100px" src='cid:logo'></p>`,
        attachments:[{
          filename:'logo.png',
          path: 'src/logo.png',
          cid: 'logo'
        }]
        })
          .then(async () => {
          })
          .catch((err) => {
            console.log(err);
          });
      }
      this.sendMailManager(await admin, forum);
    } catch (err) {
      console.log(err);

    }
  }

  async sendMailManager(user: User, forum: Forum) {
    this.mailerService
      .sendMail({
        to: user.email,
        from: 'talkboard434@gmail.com',
        subject: `יצירת הפורום ${forum.subject} הסתימה בהצלחה`,
        html: `<h2 style="text-align: center;"><strong>הי </strong><strong>${user.name}</strong><strong>,</strong></h2>
          <p style="text-align: center;">הפורום <strong>${forum.subject}</strong> נוצר בהצלחה ונשלחו הזמנות לכל משתתפי הפורום.</p>
          <p style="text-align: center;">אנו מודים לך שבחרת להצטרף לרשימת הלקוחות המרוצים שלנו,</p>
          <p style="text-align: center;">מקווים שנהנית, נשמח להמשיך לעמוד לשירותך!</p>
          <p style="text-align: center;">&nbsp;אנחנו פה לכל הערה והארה- <a href="mailto:talkBoard434@gmail.com">talkBoard434@gmail.com</a></p>
          <p style="text-align: center;">לינק לאתר: <a href="http://127.0.0.1:5173/">TalkBoard</a></p>
          <p style="text-align: center;"><img style="width: 100px" src='cid:logo'></p>`,
          attachments:[{
            filename:'logo.png',
            path: 'src/logo.png',
            cid: 'logo'
          }]
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async sendMailPassword(user: User) {
    this.mailerService
      .sendMail({
        to: user.email,
        from: 'talkboard434@gmail.com',
        subject: `עדכון סיסמה`,
        html: `<p>סיסמתך הזמנית היא: </p>
        <p>${user.password}</p>
          <p style="text-align: center;"><img style="width: 100px" src='cid:logo'></p>`,
          attachments:[{
            filename:'logo.png',
            path: 'src/logo.png',
            cid: 'logo'
          }]
      })
      .catch((err) => {
        console.log(err);
      });
  }

  

}

