import { useEffect } from 'react';
import { useFilms } from '../../hooks/use.films';
import { useUsers } from '../../hooks/use.users';
import { FilmCard } from '../film/FilmCard';
import style from './UserFilms.module.scss';
import { Header } from '../header/Header';
import { ComeBack } from '../come.back/ComeBack';
export default function UserFilms() {
  const { handleLoadFilms } = useFilms();
  const { userFilms, token } = useUsers();

  useEffect(() => {
    handleLoadFilms(); // Llama a la función
  }, [handleLoadFilms]);

  return (
    <>
      <Header title={'Films'} subtitle={'Your Films'}></Header>
      <ComeBack></ComeBack>
      <ul className={style.list}>
        {token ? (
          userFilms.length > 0 ? (
            userFilms.map((film) => <FilmCard key={film.id} item={film}></FilmCard>)
          ) : (
            <p>Sorry, you haven't added any film yet</p>
          )
        ) : (
          <p>Please log in to view your films</p>
        )}
      </ul>
    </>
  );
}