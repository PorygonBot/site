import Link from "next/link"

export function Header() {
    return (
        <div>
            <h1>Porygon</h1>
            <Link href="/">
                <a>Home</a>
            </Link>
            <br />
            <Link href="https://www.notion.so/Porygon-Setup-Usage-Tutorial-69e286240d2c4309a8d53f7a3beb7c6c">
                <a>Help</a>
            </Link>
            <br />
        </div>
    )
}