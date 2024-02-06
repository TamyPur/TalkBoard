import Fab from '@mui/material/Fab';
import { FaUserFriends } from "react-icons/fa";
import { MdOutlineGppGood } from "react-icons/md";
import { RiTodoLine } from "react-icons/ri";



export const Profile = () => {
    return (<>
        <div className="container marketing scroll">
                <h3 className='title'>פרופיל החברה</h3>
                <hr className="featurette-divider" />
            <div className="row featurette">
                <div className="order-md-2">
                    <Fab className='icon-profile' size="medium" aria-label="add">
                        <FaUserFriends />
                    </Fab>
                    <h5 className="featurette-heading fw-normal lh-1">מי אנחנו?</h5>
                    <p className="lead">
                        TalkBoard נמצאת על המפה הדיגיטלית כבר 10 שנים. בדבקות למטרה אנחנו מאמינים שנוכל להביא ללקוחות שלנו את שיא קידמת הטכנולוגיה, ולגרום להם להביא את עצמם במישור הציבורי והארגוני בצורה הטובה ביותר שיש.
                    </p>
                    <p className="lead">
                        הפורומים של TalkBoard  הם קהילות ציבוריות הנותנות את האפשרות להעלות לשיח פתוח את הנושא המבוקש ולקבל תגובות מכל מנויי המערכת. הפורומים מהווים במה ציבורית לשמוע ולהשמיע דעות, לבקשת מידע/ עזרה.
                    </p>
                </div>
            </div>
            <hr className="featurette-divider" />

            <div className="row featurette">
                <div className="order-md-2">
                    <Fab className='icon-profile' size="medium" aria-label="add">
                        <MdOutlineGppGood />
                    </Fab>
                    <h5 className="featurette-heading fw-normal lh-1">למה דווקא TalkBoard?</h5>
                    <p className="lead">
                        אנו, צוות TalkBoard פיתחנו בשבילכם את ההכי טוב שיש והפכנו את המערכת שלנו למובילה בשוק, והמועדפת ביותר (ע"פ סקר של מכון וייצמן בענייני תקשורת וחברה, מאי 2021).
                    </p>
                    <p className="lead">
                        TalkBoard בלעדית בשוק המאפשרת להקים בבמה הציבורית פורומים דיסקרטיים שיחשפו רק למשתמשים שהורשו ע"י מנהל הפורום.
                    </p>
                    <p className="lead">
                        לכן- יש לנו חברות רבות ברשימת הלקוחות המרוצים שלנו שמאפשרים תקשורת משותפת לצוות החברה, הווי חברתי, ביקורת עובדים.                        </p>
                </div>
            </div>
            <hr className="featurette-divider" />

            <div className="row featurette">
                <div className="order-md-2">
                    <Fab className='icon-profile' size="medium" aria-label="add">
                        <RiTodoLine />
                        {/* BsListTask */}
                    </Fab>
                    <h5 className="featurette-heading fw-normal lh-1">אז מה עושים?</h5>
                    <p className="lead">
                        ל TalkBoard ממשק ידידותי ונח המאפשר כניסה פשוטה וקלה למערכת ע"י הרשמה קצרה במסך הפתיחה, כל משתמש שרשום במערכת יכול לצפות ולהגיב בכל הפורומים הציבוריים, וכן- יוצגו לו כל הקהילות שאפשרו לו גישה במיוחד.                         </p>
                </div>
            </div>
            <hr className="featurette-divider" />
        </div>
    </>
    )
}
