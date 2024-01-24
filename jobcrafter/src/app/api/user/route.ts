const bcrypt = require("bcrypt");

import User from "@/app/models/User";
import connect from "../../lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get Data from the Body
    const body = await req.json();

    // Connecting to the Database
    await connect();

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(body.password, salt);

    body.password = hash;

    const user = new User(body);

    await user.save();

    return new NextResponse(JSON.stringify(user), { status: 201 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 401 });
  }
}

export const GET = async () => {
  try {
    // Check  if Admin
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (err) {
    return new NextResponse("Error in fetching user" + err, { status: 500 });
  }
};
