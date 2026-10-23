import { connectDB } from "@/lib/mongodb";
import Project from "@/model/Project";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        await connectDB()
        const projects = await Project.find({published: true})
        .sort({createdAt: -1})
        .lean()

        return Response.json(projects)
    } catch (error) {
        return Response.json({error: String(error)}, {status: 500})
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session) {
        return Response.json({error: "Unauthorized"}, {status: 401})
    }
    try {
        await connectDB();
        const body = await req.json();

        if (!body.title || !body.slug) {
            return Response.json(
                {error: "title and slug are required"},
                {status: 400}
            )
        }

        const project = await Project.create(body);
        return Response.json(project, {status: 201})
    } catch (error: any) {
        if (error.code === 11000) {
            return Response.json({error: "Slug already exists"}, {status: 409})
        }

        return Response.json({error: String(error)}, {status: 500})
    }
}