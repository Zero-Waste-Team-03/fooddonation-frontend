import appStoreIcon from "@/assets/landing/app_store.svg";
import playStoreIcon from "@/assets/landing/play_store.svg";

export function GetFromStore() {
  return (
    <div>
      <div className="flex flex-row items-center gap-4">
        <a href="#">
          <img src={appStoreIcon} alt="App Store" className="h-14" />
        </a>
        <a href="#">
          <img src={playStoreIcon} alt="Google Play" className="h-14" />
        </a>
      </div>
    </div>
  );
}
