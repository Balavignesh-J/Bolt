import { Calendar, MapPin, PenBox, Verified } from "lucide-react";
import moment from "moment";

const UserProfileInfo = ({ user, posts, profileId, setShowEdit }) => {
  return (
    <div className="relative py-4 px-6 md:px-8 bg-transparent text-slate-900 dark:text-slate-100">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-32 h-32 border-4 border-white dark:border-slate-800 shadow-xl absolute -top-16 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-xl">
          <img
            src={user.profile_picture}
            alt=""
            className="absolute rounded-full z-2 object-cover w-full h-full"
          />
        </div>
        <div className="w-full pt-16 md:pt-0 md:pl-36">
          <div className="flex flex-col md:flex-row items-start justify-between">
            <div className="">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {user.full_name}
                </h1>
                <Verified className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                {user.username ? `@${user.username}` : "Add a username"}
              </p>
            </div>
            {/* if user is not on other profile that means he is opening his profile so we will give edit button  */}

            {!profileId && (
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-2 border border-white/40 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl px-4 py-2 rounded-xl font-medium transition-all duration-200 mt-4 md:mt-0 cursor-pointer"
              >
                <PenBox className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-sm max-w-md mt-4 ">{user.bio}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400 mt-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {user.location ? user.location : `Add location`}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Joined{" "}
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {moment(user.createdAt).fromNow()}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-6 mt-6 border-t border-white/40 dark:border-white/10 pt-4">
            <div className="">
              <span className="sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                {posts.length}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 ml-1.5">
                Posts
              </span>
            </div>
            <div className="">
              <span className="sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                {user.followers.length}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 ml-1.5">
                Followers
              </span>
            </div>
            <div className="">
              <span className="sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                {user.following.length}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 ml-1.5">
                Following
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfo;
