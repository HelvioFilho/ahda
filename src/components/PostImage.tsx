import { useState } from "react";
import { Image } from "react-native";

import { Loading } from "@/components/Loading";

type PostImageProps = {
  path: string;
  height: number;
};

export function PostImage({ path, height }: PostImageProps) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        <Loading
          style={{
            position: "absolute",
            top: height / 2,
            elevation: 999,
            zIndex: 999,
          }}
          size={32}
        />
      )}
      <Image
        className="w-full h-full"
        source={{ uri: path }}
        resizeMode={"contain"}
        onLoadEnd={() => setLoading(false)}
      />
    </>
  );
}
