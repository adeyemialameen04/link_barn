import axios from "axios";
import { clearUUID, getUserUUID, setUserUUID } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/constants";
import { useAppContext } from "@/context";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { useState } from "react";

interface UserProfile {
  stxAddress: {
    mainnet: string;
  };
  //walletProvider: string;
}

interface UserData {
  profile: UserProfile;
}

export const useWallet = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userAddress, setUserAddress] = useState<string | "Connect Wallet">(
    "Connect Wallet",
  );
  const { userProfileDetails } = useAppContext();

  const appConfig = new AppConfig(["store_write", "publish_data"]);
  const userSession = new UserSession({ appConfig });

  const appDetails = {
    name: "Link Barn",
    icon: "/images/logo.svg",
  };

  const connectWallet = () => {
    showConnect({
      appDetails,
      onFinish: () => {
        handleConnect();
        window.location.reload();
      },
      onCancel: () => {
        console.log("oops, canceled");
      },
      userSession,
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut();
    setUserData(null);
    setUserAddress("Connect Wallet");
    clearUUID();
    console.log("disconnected");
  };

  const postUserData = (userData: UserData) => {
    return axios.post(API_BASE_URL + "/users", {
      auth_type: "crypto",
      stx_address_mainnet: userData.profile.stxAddress.mainnet,
      first_name: null,
      last_name: null,
      theme: null,
      profile_picture: null,
      email: null,
      username: userData.profile.stxAddress.mainnet,
      supabase_user_id: null,
      wallet_provider: null,
      //wallet_provider: userData.profile.walletProvider,
      decentralized_id: null,
      stx_address_testnet: null,
      btc_address_mainnet: null,
      btc_address_testnet: null,
      public_key: null,
      gaia_hub_url: null,
    });
  };

  const checkUserExists = async (
    field: string = "username",
    value: string = userProfileDetails?.username ?? "",
  ): Promise<{ status: boolean; message: string }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/check`, {
        field,
        value,
      });
      return {
        status: response.data.status,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error checking user existence:", error);
      return {
        status: false,
        message: "Error checking user existence",
      };
    }
  };

  const handleConnect = async () => {
    try {
      let userData;
      if (userSession.isSignInPending()) {
        userData = await userSession.handlePendingSignIn();
      } else if (userSession.isUserSignedIn()) {
        userData = userSession.loadUserData();
      } else {
        console.log("User is not signed in or pending");
        return;
      }

      setUserData(userData);
      setUserAddress(userData.profile.stxAddress.mainnet);

      if (!getUserUUID()) {
        const userExists = await checkUserExists(
          "stx_address_mainnet",
          userAddress,
        );
        if (!userExists.status) {
          const response = await postUserData(userData);
          setUserUUID(response.data.uuid);
        }
      }
    } catch (error) {
      console.error("Error handling connection or saving user data:", error);
    }
  };

  return {
    userData,
    userAddress,
    connectWallet,
    disconnectWallet,
    checkUserExists,
    handleConnect,
  };
};
