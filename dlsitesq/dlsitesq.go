package main

import (
	"bufio"
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/url"
	"os"
	"path/filepath"
	"regexp"

	firebase "firebase.google.com/go"
	"github.com/PuerkitoBio/goquery"
	"google.golang.org/api/option"
)

//ProductField プロダクトに格納するデータフィールド
type ProductField struct {
	Url        string
	Id         string
	CircleName string
	CV         []string
	Genre      []string
	Title      string
}

//ProductInfo プロダクト全体のデータ構造
type ProductInfo struct {
	Field ProductField
}

func setProductInfo(product ProductInfo) bool {
	result := true

	ctx := context.Background()
	opt := option.WithCredentialsFile("firebase-setting.json")
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		log.Fatal(err)
	}

	client, err := app.Firestore(ctx)
	if err != nil {
		log.Fatal(err)
	}

	_, err = client.Collection("products").Doc(product.Field.Id).Set(ctx, product.Field)
	if err != nil {
		log.Fatal(err)
		result = false
	}
	return result
}

func getProductCode(urlstr string) string {
	u, err := url.Parse(urlstr)
	if err != nil {
		log.Fatal(err)
	}
	rep := regexp.MustCompile(`.html$`)
	code := filepath.Base(rep.ReplaceAllString(u.Path, ""))
	//TODO: プロダクトコードのチェック
	return code

}

func getProductInfo(url string) ProductInfo {
	var result ProductInfo
	result.Field.Url = url
	result.Field.Id = getProductCode(url)
	//Add fields
	//TODO: 意図しないサイトへのアクセスをさせないようにする
	var genres []string
	var actors []string
	doc, _ := goquery.NewDocument(url)
	result.Field.CircleName = doc.Find("#work_maker > tbody > tr > td > span > a").Text()
	result.Field.Title = doc.Find("#work_name > a").Text()
	doc.Find("div.main_genre > a").Each(func(_ int, s *goquery.Selection) {
		genres = append(genres, s.Text())
	})
	result.Field.Genre = genres
	doc.Find("#work_outline > tbody > tr > th:contains('声優')").Parent().Find("td > a").Each(func(_ int, s *goquery.Selection) {
		actors = append(actors, s.Text())
	})
	result.Field.CV = actors
	/*
		doc.Find("#work_outline > tbody > tr > th:contains('声優')").Parent().Find("td > a").Each(func(_ int, s *goquery.Selection) {
			fmt.Println(s.Text())
		})
	*/

	return result
}

func main() {
	var (
		file = flag.String("f", "", "file path")
	)
	flag.Parse()

	var args []string
	if *file != "" {
		fp, err := os.Open(*file)
		if err != nil {
			panic(err)
		}
		defer fp.Close()

		scanner := bufio.NewScanner(fp)
		for scanner.Scan() {
			if scanner.Text() != "" {
				args = append(args, scanner.Text())
			}
		}
	} else {
		args = flag.Args()
	}
	for _, arg := range args {
		product := getProductInfo(arg)
		res := setProductInfo(product)
		if res != true {
			fmt.Println("setProductInfo is false")
		}
		result, _ := json.Marshal(product)
		fmt.Println(string(result))
	}
}
