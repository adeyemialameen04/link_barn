"use client";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";
import { getUserUUID } from "@/lib/auth";

export interface Link {
  id: string;
  name: string;
  index: number;
  url: string;
}

interface LinkData {
  uuid: string;
  profile_picture: string;
  first_name: string;
  last_name: string;
  links: {
    uuid: string;
    platform: string;
    index: number;
    url: string;
    user_id: string;
  }[];
}

export interface UserProfileDetails {
  uuid: string;
  profile_picture: string;
  first_name: string;
  last_name: string;
}

export const useLinkSync = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [prevlinks, setPrevLinks] = useState<Link[]>([]);
  const [userProfileDetails, setUserProfileDetails] =
    useState<UserProfileDetails | null>(null);
  const [prevUserProfileDetails, setPrevUserProfileDetails] =
    useState<UserProfileDetails | null>(null);
  const UUID = getUserUUID();
  console.log("UUID:", UUID);

  async function getLinks(
    url: string = `${API_BASE_URL}/users/?user_id=${UUID}`
  ): Promise<boolean> {
    try {
      const response = await axios.get<LinkData>(url);

      if (response.status === 200) {
        const extractedLinks: Link[] = response.data.links.map((item) => ({
          id: item.uuid,
          name: item.platform,
          url: item.url,
          index: item.index,
        }));

        const updatedLinks = updateLinkIndexes(extractedLinks);
        setLinks(updatedLinks);
        setPrevLinks(updatedLinks);

        const { uuid, profile_picture, first_name, last_name } = response.data;
        const profileDetails = { uuid, profile_picture, first_name, last_name };

        setUserProfileDetails(profileDetails);
        setPrevUserProfileDetails(profileDetails);

        return true;
      }

      console.warn(`Unexpected response status: ${response.status}`);
      return false;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      return false;
    }
  }

  const addNewLink = useCallback((index: number) => {
    const newLink: Link = {
      id: Date.now().toString(),
      name: "",
      url: "",
      index: index + 1,
    };
    setLinks((prevLinks) => [...prevLinks, newLink]);
  }, []);

  const updateLink = useCallback((id: string, updatedLink: Partial<Link>) => {
    setLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.id === id ? { ...link, ...updatedLink } : link
      )
    );
  }, []);

  const updateUserProfile = useCallback(
    (updatedProfile: Partial<UserProfileDetails>) => {
      setUserProfileDetails((prevDetails) => {
        if (!prevDetails) return null;
        return { ...prevDetails, ...updatedProfile };
      });
    },
    []
  );

  const updateLinkIndexes = (links: Link[]): Link[] => {
    return links.map((link, index) => ({ ...link, index }));
  };

  const removeLink = useCallback((id: string) => {
    setLinks((prevLinks) => {
      const updatedLinks = prevLinks
        .filter((link) => link.id !== id)
        .map((link, index) => ({ ...link, index }));
      return updatedLinks;
    });
  }, []);

  const saveLinks = useCallback(async () => {
    const updatedLinks = [];
    const newLinks = [];
    const deletedLinks = prevlinks.filter(
      (pl) => !links.some((l) => l.id === pl.id)
    );

    for (const link of links) {
      const prevLink = prevlinks.find((pl) => pl.id === link.id);
      if (
        prevLink &&
        (prevLink.name !== link.name ||
          prevLink.index !== link.index ||
          prevLink.url !== link.url)
      ) {
        updatedLinks.push(link);
      } else if (!prevLink) {
        newLinks.push(link);
      }
    }

    try {
      await Promise.all([
        ...updatedLinks.map((link) =>
          axios
            .patch(`${API_BASE_URL}/links/${link.id}`, {
              platform: link.name,
              index: link.index,
              url: link.url,
            })
            .then(() => console.log(`Updated link: ${link.name}`))
        ),
        ...newLinks.map((link) =>
          axios
            .post(`${API_BASE_URL}/links`, {
              platform: link.name,
              index: link.index,
              url: link.url,
              user_id: UUID,
            })
            .then(() => console.log(`Added new link: ${link.name}`))
        ),
        ...deletedLinks.map((link) =>
          axios
            .delete(`${API_BASE_URL}/links/${link.id}`)
            .then(() => console.log(`Deleted: ${link.name}`))
        ),
      ]);

      if (
        updatedLinks.length > 0 ||
        newLinks.length > 0 ||
        deletedLinks.length > 0
      ) {
        setPrevLinks(links);
        console.log("Links successfully synchronized with the server");
      } else {
        console.log("No changes to synchronize");
      }
    } catch (error) {
      console.error("Error synchronizing links:", error);
    }
  }, [links, prevlinks, UUID]);

  const saveUserDetails = useCallback(async () => {
    if (
      prevUserProfileDetails &&
      userProfileDetails &&
      (prevUserProfileDetails.first_name !== userProfileDetails.first_name ||
        prevUserProfileDetails.last_name !== userProfileDetails.last_name)
    ) {
      try {
        await axios
          .patch(`${API_BASE_URL}/users/?user_id=${UUID}`, {
            first_name: userProfileDetails.first_name,
            last_name: userProfileDetails.last_name,
          })
          .then(() => {
            console.log("User details updated successfully");
            setPrevUserProfileDetails(userProfileDetails);
          });
      } catch (error) {
        console.error("Error updating user details:", error);
      }
    }
  }, [prevUserProfileDetails, userProfileDetails, UUID]);

  useEffect(() => {
    if (UUID) {
      getLinks(API_BASE_URL + "/users/?user_id=" + UUID);
    }
  }, []);

  return {
    links,
    userProfileDetails,
    setLinks,
    getLinks,
    addNewLink,
    updateLink,
    updateUserProfile,
    removeLink,
    saveLinks,
    saveUserDetails,
  };
};
